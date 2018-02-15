(() => {
  const [buttons] = Array.from(document.getElementsByClassName('buttons'));
  const [inputDisplay] = document.getElementsByClassName('display__current');
  const [totalDisplay] = document.getElementsByClassName('display__total');

  let state = {
    current: '',
    decimal: false,
    operator: false,
    total: ''
  }

  buttons.addEventListener('click', runInput);


  function runInput(e) {
    let input;
    const isNumber = e.target.classList.contains('btn--number');
    const isOperator = e.target.classList.contains('btn--operator');
    const isDecimal = e.target.id === '.';
    const isCE = e.target.id === 'CE';
    const isAC = e.target.id === 'AC';
    // if current state is an operator, then reset current to avoid appending
    if (!isNotOperator(state.current)) {
      updateState({ current: '' });
    }

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
        if (state.current.length) updateState({ current: '' })
        else clearAll()
        break;
      default:
        break;
    }
    console.log(state);
    updateDisplay();
  }

  function handleNumber(num) {
    if (state.operator) updateState({ operator: false });
    if (validNumber(num)) {
      const newCurrent = state.current + num;
      const newTotal = state.total + num;
      updateState({ current: newCurrent, total: newTotal });
    }
    return true;
  }

  function validNumber(num) {
    const currentIsNumber = typeof parseFloat(state.current) === 'number' && state.current.length > 0;
    const ifFirstNotZero = state.current.length === 0 && parseInt(num, 10) > 0;
    return currentIsNumber || ifFirstNotZero;
  }

  function handleDecimal() {
    updateState({ operator: false });
    if (!state.decimal) {
      const deci = state.current.length ? '.' : '0.';
      const newCurrent = state.current + deci;
      const newTotal = state.total + deci;
      updateState({ decimal: true, current: newCurrent, total: newTotal });
    } else {
      return false; // if current already contains decimal, return false
    }
    return true;
  }

  function handleOperator(operator) {
    // If current is already operator or there is nothing to perform operation on - return false
    if (state.operator || state.total === '') {
      return false;
      // If equal sign is clicked and there is a current value, then solve the equation
    } else if (typeof parseFloat(state.current) === 'number' && operator === '=') {
      solveEquation();
      // If current is not already an operator - append operator to total and set current to operator
    } else if (!state.operator) {
      const newTotal = state.total + operator;
      updateState({ operator: true, decimal: false, current: operator, total: newTotal });
    } else {
      return false;
    }
    return true;
  }

  function solveEquation() {
    const answer = eval(state.total).toString();
    const newTotal = `${state.total}=${answer}`;
    updateState({ operator: true, decimal: false, current: answer, total: newTotal });
  }

  function updateDisplay() {
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total;
  }

  function isNotOperator(input) {
    const operators = ['+', '-', '*', '/', '='];
    return !operators.includes(input);
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }

  function clearAll() {
    updateState({ current: '', decimal: false, operator: false, total: '' });
  }

})();