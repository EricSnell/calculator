(() => {
  const [buttons] = Array.from(document.getElementsByClassName('buttons'));
  const [inputDisplay] = document.getElementsByClassName('display__current');
  const [totalDisplay] = document.getElementsByClassName('display__total');

  let state = {
    current: '',
    decimal: false,
    operator: false,
    total: '',
    answered: false
  }

  buttons.addEventListener('click', runInput);

  function runInput(e) {
    let input;
    const isNumber = e.target.classList.contains('btn--number');
    const isOperator = e.target.classList.contains('btn--operator');
    const isDecimal = e.target.id === '.';
    const isCE = e.target.id === 'CE';
    const isAC = e.target.id === 'AC';

    switch (true) {
      case isNumber:
        input = e.target.id;
        handleNumber(input);
        break;
      case isDecimal:
        handleDecimal();
        break;
      case isOperator:
        input = e.target.id;
        handleOperator(input);
        break;
      case isAC:
        clearAll();
        break;
      case isCE:
        clearInput();
        break;
      default:
        break;
    }
    updateDisplay();
  }

  function handleNumber(num) {
    if (state.operator) {
      // Append operator to total and remove from current state -- turning off flag
      const newTotal = state.total + state.current;
      updateState({ operator: false, current: '', total: newTotal });
    }
    if (validNumber(num)) {
      const newCurrent = state.current + num
      updateState({ current: newCurrent });
    }
    return true;
  }

  function validNumber(num) {
    const currentIsNumber = typeof parseFloat(state.current) === 'number' && state.current.length > 0;
    const ifFirstNotZero = state.current.length === 0 && parseInt(num, 10) > 0;
    return currentIsNumber || ifFirstNotZero;
  }

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
      updateState({ current: operator, operator: true, total: state.current, answered: false });
    } else if (typeof parseFloat(state.current) === 'number' && operator === '=') {
      solveEquation();
    } else if (!state.operator) {
      const newTotal = state.total + state.current;
      updateState({ operator: true, decimal: false, current: operator, total: newTotal, answered: false });
    } else {
      return false;
    }
    return true;
  }

  function clearInput() {
    if (state.answered) {
      clearAll();
    } else if (state.current.length) {
      updateState({ current: '' });
    } else {
      clearAll();
    }
  }

  function clearAll() {
    updateState({ current: '', decimal: false, operator: false, total: '', answered: false });
  }

  function solveEquation() {
    const equation = state.total + state.current;
    const answer = eval(equation).toString();
    const fullEquation = `${equation}=`;
    updateState({ decimal: false, current: answer, total: fullEquation, answered: true });
  }

  function updateDisplay() {
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total + state.current;
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }

})();