const bcrypt = require('bcrypt');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Salt rounds xác định độ phức tạp của việc băm, 10 là giá trị tiêu chuẩn.
const saltRounds = 10;

readline.question('Nhập mật khẩu bạn muốn băm: ', password => {
  if (!password) {
    console.error("Mật khẩu không được để trống.");
    readline.close();
    return;
  }

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error("Lỗi khi băm mật khẩu:", err);
      return;
    }
    console.log("\n✅ Băm mật khẩu thành công!");
    console.log("----------------------------------------------------");
    console.log("Hash của bạn là:", hash);
    console.log("----------------------------------------------------");
    console.log("=> Copy chuỗi hash này và dán vào biến ADMIN_PASSWORD_HASH trong tệp .env.local của bạn.");
    readline.close();
  });
});