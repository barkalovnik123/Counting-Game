'use strict';

let tableSize = [5, 5]; //размеры игр. поля

let gameTime = 40;
let lastClicked = 0;
/* последнее кликнутое число */

let isEven = true;
/* Дуратское решение проблемы: Реакт не рендерит GameTable во второй раз, потому что читает
ту же ссылку, и плюёт на то, что внутри всё сменилось.
Решается тем, что каждую нечетную игру в рендер передаётся GameTable окружённый div, иначе чистый*/

function endGame(msg) {
  msg();
  document.getElementsByClassName("swal-button")[0].addEventListener("click", () => {
    isEven = !isEven;
    lastClicked = 0;

    if (isEven) {
      //само "костыльное" решение:
      ReactDOM.render( /*#__PURE__*/React.createElement(GameTable, null), document.getElementById("root"));
    } else {
      ReactDOM.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GameTable, null)), document.getElementById("root"));
    }
  });
}

class GameTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: gameTime
    };
  }

  componentDidMount() {
    this.state = {
      time: gameTime
    };
    this.start();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  start() {
    this.timerID = setInterval(() => {
      //console.log(this.state.time);
      this.state.time--;
      this.setState({});

      if (this.state.time <= 0) {
        this.stop();
      } //console.log("tick")

    }, 1000);
  }

  stop() {
    clearInterval(this.timerID);
    endGame(() => swal("Время вышло!", "Попробуйте снова!", "error"));
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "white"
      }
    }, /*#__PURE__*/React.createElement("label", {
      className: "timeLabel"
    }, "\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0432\u0440\u0435\u043C\u0435\u043D\u0438: "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "time"
    }, this.state.time));
  }

}

class GameCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: this.props.number,
      btnclass: "gameBtn gameBtnClickable"
    };
    this.clicked = 0;
  }

  fade() {
    this.clicked = 1;
    this.setState({
      btnclass: "gameBtn transparent-text"
    });
  }

  randomColor() {
    let colors = ["red", "white", "blue", "aqua", "green", "yellow", "purple", "pink", "fuchia", "maroon", "lime", "olive", "silver", "teal"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  check() {
    if (!this.clicked) {
      if (this.props.number - lastClicked === 1) {
        //успех
        lastClicked = this.state.number;
        this.fade();
      } else {
        //поражение
        endGame(() => swal("Вы проиграли!", "Попробуйте снова!", "error"));
      }

      if (tableSize.reduce((p, n) => p * n) === lastClicked) {
        //победа
        endGame(() => swal("Победа!", "Хотите попробовать ещё? Жмите!", "success"));
      }
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("td", {
      className: "gameCell"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => this.check(),
      style: {
        color: this.randomColor()
      },
      className: this.state.btnclass
    }, this.state.number));
  }

}

class GameRow extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("tr", null, this.props.cells);
  }

}

class GameTable extends React.Component {
  //игровое поле
  constructor(props) {
    super(props);
    this.state = {};
  }

  createArray(len) {
    this.randomNumbers = Array(len).fill().map((e, i) => i + 1);

    for (let i = this.randomNumbers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.randomNumbers[i], this.randomNumbers[j]] = [this.randomNumbers[j], this.randomNumbers[i]];
    } //создаем архив рандомных чисел

  }

  generateCells(amount) {
    //создание ячеек в списке
    let elementsArray = [];

    for (let i = 0; i < amount; i++) {
      elementsArray.push( /*#__PURE__*/React.createElement(GameCell, {
        key: i,
        number: this.randomNumbers.pop()
      }));
    }

    return elementsArray;
  }

  generateRows(amount, cellsAmount) {
    //создание рядов в списке
    this.createArray(amount * cellsAmount);
    let elementsArray = [];

    for (let i = 0; i < amount; i++) {
      elementsArray.push( /*#__PURE__*/React.createElement(GameRow, {
        key: i,
        cells: this.generateCells(cellsAmount)
      }));
    }

    return elementsArray;
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(GameTimer, null), /*#__PURE__*/React.createElement("table", {
      className: "gameTable"
    }, /*#__PURE__*/React.createElement("tbody", null, this.generateRows(tableSize[0], tableSize[1]))));
  }

}

class StartWindow extends React.Component {
  //стартовое меню с кнопкой старт
  constructor(props) {
    super(props);
    this.state = {
      display: "flex"
    }; //по стандарту флекс
  }

  gameStart() {
    //становится невидимым по началу игры (навсегда...)
    ReactDOM.render( /*#__PURE__*/React.createElement(GameTable, null), document.getElementById("root"));
    this.state.display = "none";
    this.setState({});
  }

  render() {
    return (
      /*#__PURE__*/
      //само оно
      React.createElement("div", {
        style: {
          display: this.state.display
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => this.gameStart()
      }, "START"))
    );
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(StartWindow, null), document.getElementById("window")); //по началу рендерится оно
