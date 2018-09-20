/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Calculator; });


const Calculator = () => {
  /* Cache DOM */
  const [buttons] = Array.from(document.querySelectorAll('.buttons'));
  const [inputDisplay] = document.querySelectorAll('.display__current');
  const [totalDisplay] = document.querySelectorAll('.display__total');

  /* Application State */
  let state = {
    current: '',
    decimal: false,
    operator: false,
    total: '',
    answered: false
  };

  /* Event Listeners */
  buttons.addEventListener('click', runInput);

  /* Function To Run On Button Click */
  function runInput(e) {
    e.preventDefault();
    let input;
    const isNumber = e.target.classList.contains('btn--number');
    const isOperator = e.target.classList.contains('btn--operator');
    const isDecimal = e.target.id === '.';
    const isCE = e.target.id === 'CE';
    const isAC = e.target.id === 'AC';

    switch (true) {
      case isNumber:
        input = e.target.id;
        animate(e, 'number');
        handleNumber(input);
        break;
      case isDecimal:
        animate(e, 'number');
        handleDecimal();
        break;
      case isOperator:
        input = e.target.id;
        animate(e, 'operator');
        handleOperator(input);
        break;
      case isAC:
        animate(e, 'clear');
        clearAll();
        break;
      case isCE:
        animate(e, 'clear');
        clearInput();
        break;
      default:
        break;
    }
    updateDisplay();
  }

  /* Button Click Animation */
  function animate(e, type) {
    const allButtons = Array.from(document.querySelectorAll('.buttons__btn'));
    allButtons.forEach(btn => btn.classList.remove(`glow-fade-${type}`));
    void e.target.offsetWidth; // hack to allow animation to run consecutively on same element
    e.target.classList.add(`glow-fade-${type}`);
  }

  /* If Number Button Pressed */
  function handleNumber(num) {
    // Prevent user from entering more than 9 digits
    if (state.current.replace(/,|\./g, '').length >= 9) return;
    // Checks if input is following an operator
    if (state.operator) {
      // Append operator to total and turn off operator flag
      const newTotal = state.total + state.current;
      updateState({ operator: false, current: '', total: newTotal });
    }
    if (validNumber(num)) {
      const newCurrent = state.current.replace(/,/g, '') + num;
      updateState({
        current: Number(newCurrent).toLocaleString(undefined, {
          maximumSignificantDigits: 9
        })
      });
    }
  }

  /* Checks If Number Entered Is Valid Input */
  function validNumber(num) {
    const currentIsNumber =
      typeof parseFloat(state.current) === 'number' && state.current.length > 0;
    const ifFirstNotZero = state.current.length === 0 && parseInt(num, 10) > 0;
    return currentIsNumber || ifFirstNotZero;
  }

  /* Handles Decimal Input */
  function handleDecimal() {
    if (!state.decimal) {
      if (state.operator) {
        const newTotal = state.total + state.current;
        updateState({ current: '', total: newTotal });
      }
      const deci = state.current.length ? '.' : '0.';
      const newCurrent = state.current + deci;
      updateState({ decimal: true, operator: false, current: newCurrent });
      // if current already contains decimal, return false
    } else {
      return false;
    }
  }

  function handleOperator(operator) {
    // If current is already operator or there is nothing to perform operation on - return false
    if (
      state.operator ||
      state.current.length === 0 ||
      (state.answered && operator === '=')
    ) {
      return false;
    } else if (state.answered) {
      updateState({
        current: operator,
        operator: true,
        total: state.current,
        answered: false
      });
    } else if (
      typeof parseFloat(state.current) === 'number' &&
      operator === '='
    ) {
      showAnswer();
    } else if (!state.operator) {
      const newTotal = state.total + state.current;
      updateState({
        operator: true,
        decimal: false,
        current: operator,
        total: newTotal,
        answered: false
      });
    } else {
      return false;
    }
  }

  function clearInput() {
    if (state.answered) {
      clearAll();
    } else if (state.operator) {
      updateState({ operator: false, current: '' });
    } else if (state.current.length) {
      updateState({ current: '', decimal: false });
    } else {
      clearAll();
    }
  }

  function clearAll() {
    updateState({
      current: '',
      decimal: false,
      operator: false,
      total: '',
      answered: false
    });
  }

  function showAnswer() {
    const answer = formatAnswer();
    updateState({
      decimal: false,
      current: answer,
      total: '',
      answered: true
    });
  }

  function formatAnswer() {
    const answer = solveEquation();
    const exceedsLimit = checkLength(answer);
    return exceedsLimit ? expoNotation(answer) : answer;
  }

  function solveEquation() {
    const equation = (state.total + state.current).replace(/,/g, '');
    const answer = eval(equation).toLocaleString(undefined, {
      maximumSignificantDigits: 9
    });
    return answer;
  }

  function expoNotation(num) {
    return Number.parseFloat(num.replace(/,/g, ''))
      .toExponential(0)
      .replace(/\+/g, '');
  }

  function checkLength(num) {
    const trimmedNum = num.replace(/,|\./g, '');
    return trimmedNum.length > 9;
  }

  function updateDisplay() {
    adjustInputSize();
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total + state.current;
  }

  function adjustInputSize() {
    const inputLength = state.current.replace(/,|\./g, '').length;
    switch (inputLength) {
      case 6:
        inputDisplay.style.fontSize = '10.3rem';
        break;
      case 7:
        inputDisplay.style.fontSize = '8.4rem';
        break;
      case 8:
        inputDisplay.style.fontSize = '7.4rem';
        break;
      case 9:
        inputDisplay.style.fontSize = '6.8rem';
        break;
      default:
        inputDisplay.style.fontSize = '11rem';
        break;
    }
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sass_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _sass_styles_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sass_styles_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _calculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);



Object(_calculator__WEBPACK_IMPORTED_MODULE_1__[/* Calculator */ "a"])();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })
/******/ ]);