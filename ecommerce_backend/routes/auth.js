const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Helper function to generate JWT token
const generateToken = (user) => {
  console.log("generateToken: ", user)
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// GitHub OAuth callback
router.post('/github/callback', async (req, res) => {
    const { code } = req.body;
    console.log("code: ",code)
    try {
        // Exchange code for access token
        const { data: tokenResponse } = await axios.post('https://github.com/login/oauth/access_token', null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/login?provider=github'
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        const { access_token } = tokenResponse;
        // Fetch user info
        const { data: userData } = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': 'application/json'
            }
        });

        const { email, name } = userData;
        const [firstName, lastName] = name ? name.split(' ') : ['', ''];
         const password=firstName + "8" + lastName
        
         const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists or create new one
        let user = await User.findOne({ email });
    
        if (user==null) {
            user = new User({
                email,
                firstName,
                lastName,
                phoneNo:8806235334,
                password: hashedPassword , 
                role: 'ADMIN',
                userType:"admin"
            });
            await user.save();
        }
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'OAuth authentication failed' });
    }
});

// LinkedIn OAuth callback
router.post('/linkedin/callback', async (req, res) => {
    const { code } = req.body;

    try {
        const { data: tokenResponse } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://localhost:3000/login?provider=linkedin',
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }
        });

        const { access_token } = tokenResponse;

        const { data: userData } = await axios.get('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const email = emailResponse.data.elements[0]['handle~'].emailAddress;
        const { localizedFirstName: firstName, localizedLastName: lastName } = userData;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                firstName,
                lastName,
                password: firstName + "8" + lastName,
                role: 'USER'
            });
            await user.save();
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'OAuth authentication failed' });
    }
});

// Facebook OAuth callback
router.post('/facebook/callback', async (req, res) => {
    const { code } = req.body;
    try {
        const { data: tokenResponse } = await axios.get('https://graph.facebook.com/v10.0/oauth/access_token', {
            params: {
                client_id: process.env.FACEBOOK_CLIENT_ID,
                client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/login?provider=facebook'
               
            }
        });

        const { access_token } = tokenResponse;
        const { data: userData } = await axios.get('https://graph.facebook.com/me?fields=id,name,email', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                 'Accept': 'application/json'
            }
        });
        console.log("userdata: ", userData)
        const { id,name } = userData;
        const [firstName, lastName] = name ? name.split(' ') : ['', ''];
              
        const email =firstName+id+"@gmail.com";
        const password=id;
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });
        console.log("user: ",user)
        if (user==null) {
          user = new User({
              email,
              firstName,
              lastName,
              phoneNo:8806235335,
              password: hashedPassword , 
              role: 'ADMIN',
              userType:"admin"
          });

          await user.save();
      }
        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'OAuth authentication failed' });
    }
});

module.exports = router;
