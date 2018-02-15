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
        if (state.current.length) updateState({ current: '' })
        else clearAll()
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
      if (state.answered) clearAll();
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
    } else {
      return false; // if current already contains decimal, return false
    }
    return true;
  }

  function handleOperator(operator) {
    // If current is already operator or there is nothing to perform operation on - return false
    if (state.operator) {
      return false;
      // If equal sign is clicked and there is a current value, then solve the equation
    } else if (typeof parseFloat(state.current) === 'number' && operator === '=') {
      state.total += state.current;
      solveEquation();
      // If current is not already an operator - append operator to total and set current to operator
    } else if (!state.operator) {
      updateState({ operator: true, decimal: false, current: operator, total: state.current, answered: false });
    } else {
      return false;
    }
    return true;
  }

  function solveEquation() {
    const answer = eval(state.total).toString();
    const newTotal = `${state.total}=`;
    updateState({ decimal: false, current: answer, total: newTotal, answered: true });
  }

  function updateDisplay() {
    inputDisplay.innerText = state.current;
    totalDisplay.innerText = state.total + state.current;
  }

  function updateState(propsToUpdate = {}) {
    state = Object.assign({}, state, propsToUpdate);
  }

  function clearAll() {
    updateState({ current: '', decimal: false, operator: false, total: '', answered: false });
  }

})();