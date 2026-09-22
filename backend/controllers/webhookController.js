const { Webhook } = require('svix');
const User = require('../models/User'); // Adjust path if your model is elsewhere

// Function to handle Clerk webhooks
exports.clerkWebhook = async (req, res) => {
  try {
    const payloadString = req.body.toString();
    const svixHeaders = req.headers;
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    let evt;
    try {
      evt = wh.verify(payloadString, svixHeaders);
    } catch (err) {
      console.error('Webhook verification failed', err.message);
      return res.status(400).json({ success: false, message: 'Webhook verification failed' });
    }

    const { id, ...attributes } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const email = attributes.email_addresses[0].email_address;
      const name = `${attributes.first_name || ''} ${attributes.last_name || ''}`.trim();
      
      const newUser = new User({
        clerkId: id,
        email,
        name,
        profileImage: attributes.image_url || 'default.jpg',
        college: 'Not specified',
        city: 'Not specified',
        password: 'OAUTH_PROVIDER_NO_PASSWORD' 
      });

      const savedUser = await newUser.save();
      console.log(`Clerk User Created: ${email}`);

      // Create an initial empty profile for this user
      const Profile = require('../models/Profile');
      const newProfile = new Profile({
        user: savedUser._id
      });
      await newProfile.save();
      console.log(`Initial Profile created for user: ${email}`);
    }

    if (eventType === 'user.updated') {
      // Handle user update if necessary
    }

    if (eventType === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: id });
      console.log(`Clerk User Deleted: ${id}`);
    }

    res.status(200).json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
