// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // In production this would send an email or store in a ContactInquiry model
    console.log(`[Contact Inquiry Received] From: ${name} <${email}> | Subject: ${subject || 'General'} | Message: ${message}`);

    res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you within 24 hours.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/contact/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    console.log(`[Newsletter Subscription] New subscriber: ${email}`);

    res.status(200).json({
      success: true,
      message: '🎉 You have successfully subscribed to the ShopSphere VIP newsletter! Enjoy 10% off with coupon SAVE10.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
