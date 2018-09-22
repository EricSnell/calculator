('use strict');

export const Calculator = () => {
  /* Cache DOM */
  const [buttons] = Array.from(document.querySelectorAll('.buttons'));
  const displayNum = document.querySelector('.display__current');
  const displayTotal = document.querySelector('.display__total');

  /* Application State */
  let state = {
    current: '',
    prevInput: '',
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
    if (e.target.tagName !== 'BUTTON') return;
    const {
      textContent: input,
      dataset: { actionJs: action }
    } = e.target;
    const type = getType(action);

    switch (type) {
      case 'number':
        animate(e, type);
        handleNumber(input);
        break;
      case 'operator':
        animate(e, type);
        handleOperator(input);
        break;
      case 'decimal':
        animate(e, 'number');
        handleDecimal();
        break;
      case 'clear-all':
        animate(e, type);
        clearAll();
        break;
      case 'clear':
        animate(e, type);
        clearInput();
        break;
      default:
        break;
    }
    updateDisplay(state);
  }

  function getType(action) {
    if (!action) return 'number';
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) {
      return 'operator';
    }
    return action;
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
    if (maxLength(state.current)) return;
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
      if (state.current.replace(/,|\./g, '').length >= 9) return;
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
      state.current.charAt(state.current.length - 1) === '.' ||
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
      console.log(state.current);
      showAnswer();
    } else if (!state.operator) {
      console.log(state.current);
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
    const exceedsLimit = maxLength(answer);
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

  function maxLength(num) {
    const limit = state.current === '=' ? 9 : 8;
    const trimmedNum = num.replace(/,|\./g, '');
    return trimmedNum.length > limit;
  }

  function updateDisplay({ current, total }) {
    resizeDisplayFont(current);
    displayNum.innerText = current;
    displayTotal.innerText = total + current;
  }

  function resizeDisplayFont(num) {
    const currentLength = num.replace(/,|\./g, '').length;
    displayNum.style.fontSize = determineSize(currentLength);
  }

  function determineSize(num) {
    let sizes = {
      '6': '10.3rem',
      '7': '8.4rem',
      '8': '7.4rem',
      '9': '6.8rem'
    };
    let defaultSize = '11rem';
    return sizes[num] || defaultSize;
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }
};
