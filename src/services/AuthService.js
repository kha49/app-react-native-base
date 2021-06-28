import mushroom from './mushroom.api.def';
import {blockUi, unblockUi} from '../shared/global';

window.requestCount = 0;

// đăng nhập
let AuthService = {};

AuthService.login = (account, password, remember) => {
  return mushroom.$auth
    .loginAsync(account, password, remember)
    .then(response => {
      console.log('Đăng nhập thành công, token: ' + response.result);
      return response;
    })
    .catch(error => {
      console.log('Đăng nhập thất bại: %o', error);
      throw error;
    });
};

// đăng xuất
AuthService.logout = logoutAll => {
  return mushroom.$auth
    .logoutAsync({
      mode: logoutAll ? 'invalidAllSession' : 'invalidClientSession',
    })
    .then(response => {
      console.log('Đã logout');
      return response;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

// Kiểm tra trạng thái đăng nhập
AuthService.status = () => {
  return mushroom.$auth
    .statusAsync()
    .then(response => {
      console.log('status = ' + response.status);
      return response.status;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

// Lấy về thông tin người dùng hiện tại
AuthService.me = () => {
  return mushroom.$auth
    .meAsync()
    .then(response => {
      console.log('response data: %o', response);
      return response;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

// đăng ký
AuthService.register = (account, password) => {
  return mushroom.$auth
    .registerAsync(account, password)
    .then(response => {
      if (response.requireActivation) {
        console.log(
          'Đăng ký thành công, bạn hãy checkmail để kích hoạt tài khoản',
        );
      } else {
        console.log('Đăng ký thành công');
      }
      return response;
    })
    .catch(error => {
      console.log('Đăng ký thất bại: %o', error);
      throw error;
    });
};

// kick hoạt tài khoản
AuthService.activate = (account, activationCode) => {
  return mushroom.$auth
    .activateAsync(account, activationCode)
    .then(response => {
      console.log('Kích hoạt thành công');
      return response;
    })
    .catch(error => {
      console.log('Kích hoạt thất bại: %o', error);
      throw error;
    });
};

// lấy lại mật khẩu
AuthService.recoverPassword = account => {
  return mushroom.$auth
    .recoverPasswordAsync(account)
    .then(response => {
      console.log('Bạn hãy check mail để lấy mật khẩu');
      return response;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

// khôi phục mật khẩu
AuthService.resetPassword = (account, code, newPassword) => {
  return mushroom.$auth
    .resetPasswordAsync(account, code, newPassword)
    .then(response => {
      console.log('Đã đặt lại mật khẩu dựa trên mã khôi phục mật khẩu');
      return response;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

// đổi mật khẩu
AuthService.changePassword = (account, password, newPassword) => {
  return mushroom.$auth
    .changePasswordAsync(account, password, newPassword)
    .then(response => {
      console.log('Đã đổi mật khẩu thành công');
      return response;
    })
    .catch(error => {
      console.log('Có lỗi: %o', error);
      throw error;
    });
};

export default AuthService;
