(() => {
  /* AC --- Clears input and total
     CE --- Clears current input (not total)

     - Variables
          = current input
          = total
          = decimal flag

     - Event listener on each button (click)
     - Check which ID was clicked
     - If operator - next button cannot be another operator
     - If decimal - current cannot already contain decimal (check flag)
     - If number - append number to current input var 
     - If operator, take current input and set as total plus operator
     - If AC - reset all values
     - If CE - clear input only (clear all if pressed again)
     - If equal - run the total and set the current input to result
     - First number of total cannot be zero
  */

  const state = {
    current: null,
    decimal: false,
    total: null
  }

  const [buttons] = Array.from(document.getElementsByClassName('buttons'));
  const [inputDisplay] = document.getElementsByClassName('display__current');
  const [totalDisplay] = document.getElementsByClassName('display__total');

  buttons.addEventListener('click', (e) => {
    let input;
    const isNumber = e.target.classList.contains('btn--number');
    const isDecimal = e.target.id === 'decimal';
    const isOperator = e.target.classList.contains('btn--operator');

    if (isNumber) {
      // convert input to number
      // if current is already a number, append to current state
      // set current state to number and append to total
      // display both current and total
    }

    else if (isDecimal) {
      // if flag is false, set to true and continue, otherwise return false
      // append to current and total states
      // if current state has no length, append a 0 before the decimal
    }

    else if (isOperator) {
      // check if current state is already an operator
      // if so...return false
      // set operator by targets id and replace input display with operator
      // if operator is equals - pass the state total into eval() 
      // set answer to the display
    }

  });


})();