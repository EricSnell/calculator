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

  buttons.addEventListener('click', run);


  function run(e) {
    let input;
    const isNumber = e.target.classList.contains('btn--number');
    const isOperator = e.target.classList.contains('btn--operator');
    const isDecimal = e.target.id === '.';
    const isCE = e.target.id === 'CE';
    const isAC = e.target.id === 'AC';
    // if current state is an operator, then reset to stop appending
    if (!isNotOperator(state.current)) {
      updateState({ current: '' });
    }

    switch (true) {
      case isNumber:
        input = e.target.id;
        updateState({ operator: false });
        handleNumber(input);
        break;
      case isDecimal:
        updateState({ operator: false });
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
    updateDisplay();
  }

  function handleNumber(num) {
    // if current state is a number or if it's empty
    if (validNumber(num)) {
      const newCurrent = state.current + num;
      const newTotal = state.total + num;
      updateState({ current: newCurrent, total: newTotal });
    }
    return true;
  }

  function validNumber(num) {
    return typeof parseFloat(state.current) === 'number' &&
      state.current.length > 0 ||
      (state.current.length === 0 && parseInt(num, 10) > 0);
  }

  function handleDecimal() {
    if (!state.decimal) {
      const deci = state.current.length ? '.' : '0.';
      const newCurrent = state.current + deci;
      const newTotal = state.total + deci;
      updateState({ decimal: true, current: newCurrent, total: newTotal });
    } else {
      return false;
    }
    return true;
  }

  function handleOperator(operator) {
    if (state.operator || state.total === '') {
      return false;
    }
    if (typeof parseFloat(state.current) === 'number' && operator === '=') {
      solveEquation();
    } else if (isNotOperator(state.current)) {
      state.operator = true;
      state.decimal = false;
      state.current = operator;
      state.total += operator;
    } else {
      return false;
    }
    return true;
  }

  function solveEquation() {
    const answer = eval(state.total);
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