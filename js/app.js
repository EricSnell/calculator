(() => {
  /* AC --- Clears input and total
     CE --- Clears current input (not total)

     - Variables
          = current input
          = total
          = decimal flag

     - If operator - next button cannot be another operator
     - If operator, take current input and set as total plus operator
     - If AC - reset all values
     - If CE - clear input only (clear all if pressed again)
     - If equal - run the total and set the current input to result
     - First number of total cannot be zero
  */

  const state = {
    current: '',
    decimal: false,
    total: ''
  }

  const [buttons] = Array.from(document.getElementsByClassName('buttons'));
  const [inputDisplay] = document.getElementsByClassName('display__current');
  const [totalDisplay] = document.getElementsByClassName('display__total');

  buttons.addEventListener('click', (e) => {
    let input;
    const isNumber = e.target.classList.contains('btn--number') && e.target.id !== '.';
    const isDecimal = e.target.id === '.';
    const isOp = e.target.classList.contains('btn--operator');

    if (isNumber) {
      input = e.target.id;
      // if current state is a number or if it's empty
      if (typeof parseInt(state.current) === 'number' || state.current.length === 0) {
        if (isNotOperator(state.current)) {
          state.current += input;
        } else {
          state.current = e.target.id;
        }
      }
      state.total += input;
    }

    else if (isDecimal) {
      if (!state.decimal) {
        input = state.current.length ? '.' : '0.';
        state.decimal = true;
        state.current += input;
        state.total += input;
      } else {
        return false;
      }
    }

    else if (isOp) {
      // check if current state is already an operator
      if (isNotOperator(state.current)) {
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

    console.log('state:', state);
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total;

  });

  function isNotOperator(input) {
    const operators = ['+', '-', '*', '/', '='];
    return !operators.includes(input);
  }


})();