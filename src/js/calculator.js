('use strict');

export const Calculator = () => {
  /* Cache DOM */
  const [buttons] = Array.from(document.getElementsByClassName('buttons'));
  const [inputDisplay] = document.getElementsByClassName('display__current');
  const [totalDisplay] = document.getElementsByClassName('display__total');

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
    if (state.operator) {
      // Append operator to total and remove from current state -- turning off flag
      const newTotal = state.total + state.current;
      updateState({ operator: false, current: '', total: newTotal });
    }
    if (validNumber(num)) {
      const newCurrent = state.current + num;
      updateState({ current: newCurrent });
    }
    return true;
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
    return true;
  }

  function handleOperator(operator) {
    // If current is already operator or there is nothing to perform operation on - return false
    if (state.operator || state.current.length === 0) {
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
      solveEquation();
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
    return true;
  }

  function clearInput() {
    if (state.answered) {
      clearAll();
    } else if (state.operator) {
      updateState({ operator: false, current: '' });
    } else if (state.current.length) {
      updateState({ current: '' });
    } else {
      clearAll();
    }
  }

  function addCommasToNum(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  function solveEquation() {
    const equation = state.total + state.current;
    const answer = eval(equation).toString();
    const fullEquation = `${equation}=`;
    updateState({
      decimal: false,
      current: answer,
      total: fullEquation,
      answered: true
    });
  }

  function updateDisplay() {
    inputDisplay.innerText = addCommasToNum(state.current);
    totalDisplay.innerText =
      addCommasToNum(state.total) + addCommasToNum(state.current);
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }
};
