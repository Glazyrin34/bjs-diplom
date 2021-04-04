  "use strict"

const userForm = new UserForm();

//Вход
userForm.loginFormCallback = data => {
  ApiConnector.login(data, response => {
    console.log(response);

    return response.success ? 
           location.reload() :
           userForm.setLoginErrorMessage(response.error);
  });
};

//Регистрация
userForm.registerFormCallback = data => {
  ApiConnector.register(data, response => {
    console.log(response);

    return response.success ?
           location.reload() :
           userForm.setRegisterErrorMessage(response.error);
  });
};