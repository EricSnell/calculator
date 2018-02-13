(() => {
  /* 
     - If operator - next button cannot be another operator
     - If operator, take current input and set as total plus operator
     - First number of total cannot be zero
  */


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
    const isNumber = e.target.classList.contains('btn--number') && e.target.id !== '.';
    const isDecimal = e.target.id === '.';
    const isOperator = e.target.classList.contains('btn--operator');
    const isCE = e.target.id === 'CE';
    const isAC = e.target.id === 'AC';

    // if current state is an operator, then reset to avoid appending to 
    if (!isNotOperator(state.current)) {
      resetCurrent();
    }

    if (isNumber) {
      state.operator = false;
      input = e.target.id;
      // if current state is a number or if it's empty
      if ((typeof parseFloat(state.current) === 'number' && state.current.length > 0) || (state.current.length === 0 && parseInt(input) > 0)) {
        state.current += input;
        state.total += input;
      }
    }

    else if (isDecimal) {
      state.operator = false;
      if (!state.decimal) {
        input = state.current.length ? '.' : '0.';
        state.decimal = true;
        state.current += input;
        state.total += input;
      } else {
        return false;
      }
    }

    else if (isOperator) {
      if (state.operator) {
        return false;
      }
      // check if current state is a number and that the equal sign was pressed
      if (typeof parseFloat(state.current) === 'number' && e.target.id === '=') {
        state.operator = true;
        const answer = eval(state.total);
        state.decimal = false;
        state.total += `=${answer}`;
        state.current = answer;
      } else if (isNotOperator(state.current)) {
        state.operator = true;
        state.decimal = false;
        state.current = e.target.id;
        state.total += e.target.id;
      } else {
        return false;
      }
      // if so...return false
      // set operator by targets id and replace input display with operator
      // if operator is equals - pass the state total into eval() 
      // set answer to the display
    }

    else if (isAC) {
      clearAll();
      console.clear();
    }

    else if (isCE) {
      if (state.current.length) {
        resetCurrent();
      } else {
        clearAll();
      }
    }

    updateDisplay();
    console.log('state:', state);
  });





  function updateDisplay() {
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total;
  }

  function isNotOperator(input) {
    const operators = ['+', '-', '*', '/', '='];
    console.log('input>>>', input);
    return !operators.includes(input);
  }

  function resetCurrent() {
    state = Object.assign({}, state, { current: '' });
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