const supabase = require('./src/config/database');

async function makeUserAdmin(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('email', email)
      .select();

    if (error) {
      console.error('Error making user admin:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Successfully made ${email} an admin user`);
      console.log('User details:', data[0]);
    } else {
      console.log(`❌ User with email ${email} not found`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Make the current user an admin
makeUserAdmin('junaidmushtaq988@gmail.com');
