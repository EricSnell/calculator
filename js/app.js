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

  buttons.addEventListener('click', (e) => {
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

    if (isNumber) {
      input = e.target.id;
      updateState({ operator: false });
      handleNumber(input);
    }

    else if (isDecimal) {
      updateState({ operator: false });
      handleDecimal();
    }

    else if (isOperator) {
      const operator = e.target.id;
      if (state.operator || state.total === '') {
        return false;
      }
      handleOperator(operator);
    }

    else if (isAC) {
      clearAll();
    }

    else if (isCE) {
      if (state.current.length) {
        updateState({ current: '' });
      } else {
        clearAll();
      }
    }

    updateDisplay();
  });












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

  function handleOperator(input) {
    if (typeof parseFloat(state.current) === 'number' && input === '=') {
      const answer = eval(state.total);
      state.operator = true;
      state.decimal = false;
      state.total += `=${answer}`;
      state.current = answer;
    } else if (isNotOperator(state.current)) {
      state.operator = true;
      state.decimal = false;
      state.current = input;
      state.total += input;
    } else {
      return false;
    }
    return true;
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
    const newState = {
      current: '',
      decimal: false,
      operator: false,
      total: ''
    }
    state = { ...newState };
  }

})();