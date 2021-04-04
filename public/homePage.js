"use strict";

//Выход из личного кабинета
const logoutButton = new LogoutButton();

logoutButton.action = () => {
    ApiConnector.logout(response => {
        if(response.success) {
            location.reload();
        }
    });
}

//Получение информации о пользователе
ApiConnector.current(response => {
    if(response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

//Получение текущих курсов валюты
const ratesBoard = new RatesBoard();

function getCurrentRates() {
    ApiConnector.getStocks(response => {
            if(response.success) {
                ratesBoard.clearTable();
                ratesBoard.fillTable(response.data);
            }
        });
}

getCurrentRates();
setTimeout(getCurrentRates, 1000 * 60);

//Операции с деньгами
const moneyManager = new MoneyManager();

function checkStatus(data, response, message){
    if(response.success){
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, message);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  }
  
//Реализация пополнения баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
      const msg = `Пополнение счёта на ${data.amount} ${data.currency}`
      checkStatus(data, response, msg);
    });
  }
  
//Реализация конвертирования валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
      const msg = `Конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`;
      checkStatus(data, response, msg);
    })
}
  
//Реализация перевода валюты
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
      const msg = `Перевод ${data.amount} ${data.currency } пользователю ID ${data.to}`;
      checkStatus(data, response, msg);
    })
}
  
//Работа с избранными
const favoritesWidget = new FavoritesWidget();
 

function getCurrentDataList(response){
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
}

//Запрос начального списка избранного
ApiConnector.getFavorites(response => {
    if(response.success){
      getCurrentDataList(response);
    }
})

//Реализация добавления пользователя в список избранных
favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
      if(response.success){
        getCurrentDataList(response);
        moneyManager.setMessage(response.success, `${data.name} добавлен`);
      } else {
        moneyManager.setMessage(response.success, response.error);
      }
    }) 
}

//Реализация удаления пользователя из избранного
favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
      if(response.success){
        getCurrentDataList(response);
        moneyManager.setMessage(response.success, `ID ${data} удален`);
      } else {
        moneyManager.setMessage(response.success, response.error);
      }
    }) 
}