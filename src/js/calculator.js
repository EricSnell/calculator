import { format } from 'path';

('use strict');

export const Calculator = () => {
  /* Cache DOM */
  const [buttons] = Array.from(document.querySelectorAll('.buttons'));
  const displayNum = document.querySelector('.display__current');
  const displayTotal = document.querySelector('.display__total');

  /* Application State */
  let state = {
    current: '',
    decimal: false,
    operator: false,
    total: '',
    calculated: false
  };

  /* Event Listeners */
  buttons.addEventListener('click', run);

  /* Function To Run On Button Click */
  function run(e) {
    e.preventDefault();
    if (e.target.tagName !== 'BUTTON') return;
    const {
      textContent: input,
      dataset: { actionJs: action }
    } = e.target;
    const type = getType(action);
    handleInput(type, input);
    animate(e, type);
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

  function handleInput(type, input) {
    if (type === 'number') {
      if (state.operator) {
        const newTotal = state.total + state.current;
        updateState({ operator: false, current: '', total: newTotal });
      } else if (state.calculated) clearAll();
      if (validNumber(input)) {
        if (maxLength(state.current, 8)) return;
        const newCurrent = state.current + input;
        updateState({
          current: newCurrent
        });
      }
    } else if (type === 'operator') {
      const operatorMap = {
        '+': '+',
        '−': '-',
        '×': '*',
        '÷': '/'
      };
      const operator = operatorMap[input];
      const followsDecimal =
        state.current.charAt(state.current.length - 1) === '.';
      if (state.operator) updateState({ current: operator });
      else if (!state.current || followsDecimal) return false;
      else if (state.calculated) {
        updateState({
          current: operator,
          operator: true,
          total: addComma(state.current),
          calculated: false
        });
      } else if (!state.operator) {
        const newTotal = state.total + addComma(state.current);
        updateState({
          operator: true,
          decimal: false,
          current: operator,
          total: newTotal,
          calculated: false
        });
      }
    } else if (type === 'calculate') {
      if (!isNaN(state.current) && state.current) calculate(state);
      else return;
    } else if (type === 'decimal') {
      if (!state.decimal) {
        if (state.current.length >= 9) return;
        if (state.operator) {
          const newTotal = state.total + state.current;
          updateState({ current: '', total: newTotal });
        } else if (state.calculated) clearAll();
        const deci = state.current.length ? '.' : '0.';
        const newCurrent = state.current + deci;
        updateState({ decimal: true, operator: false, current: newCurrent });
      } else return false;
    } else if (type === 'clear-all') clearAll();
    else if (type === 'clear') clearInput(state);
  }

  /**
   * HANDLE CLEAR/CLEAR-ALL OPERATIONS
   */
  function clearInput({ calculated, operator, current }) {
    if (calculated) clearAll();
    else if (operator) updateState({ operator: false, current: '' });
    else if (current.length) updateState({ current: '', decimal: false });
    else clearAll();
  }

  function clearAll() {
    updateState({
      current: '',
      decimal: false,
      operator: false,
      total: '',
      calculated: false
    });
  }

  /**
   * HANDLE CALCULATION
   */
  function calculate(state) {
    const answer = formatAnswer(state);
    updateState({
      decimal: false,
      current: answer,
      total: '',
      calculated: true
    });
  }

  function formatAnswer({ current, total }) {
    const equation = total.replace(/,/g, '') + current;
    const answer = eval(equation)
      .toLocaleString(undefined, {
        maximumSignificantDigits: 9
      })
      .replace(/,/g, '');
    const exceedsLimit = maxLength(answer, 9);
    return exceedsLimit ? expoNotation(answer) : answer;
  }

  /**
   * UPDATE DISPLAY
   */
  function updateDisplay({ current, total }) {
    updateFontSize(current);
    const newCurrent = addComma(current);
    displayNum.innerText = newCurrent;
    displayTotal.innerText = total + newCurrent;
  }

  function addComma(num) {
    const isExponent = num.includes('e');
    if (isExponent || num.length < 3) return num;
    else if (state.decimal) {
      const leftOfDecimal = num.substring(0, num.indexOf('.'));
      const rightOfDecimal = num.substring(num.indexOf('.'));
      return leftOfDecimal.length > 3
        ? Number(leftOfDecimal).toLocaleString() + rightOfDecimal
        : num;
    }
    return Number(num).toLocaleString(undefined, {
      maximumSignificantDigits: 9
    });
  }

  function updateFontSize(num) {
    const currentLength = num.replace(/-|,|\./g, '').length;
    displayNum.style.fontSize = determineSize(currentLength);
  }
  // feels hacky -- temporary solution
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

  function animate(e, type) {
    const key = e.target;
    const allButtons = Array.from(document.querySelectorAll('.buttons__btn'));
    allButtons.forEach(btn => btn.classList.remove('active'));
    void key.offsetWidth; // hack to allow animation to run consecutively on same element
    key.classList.add('active');
  }

  /**
   * HELPER FUNCTIONS
   */
  function expoNotation(num) {
    return parseFloat(num.replace(/,/g, ''))
      .toExponential(0)
      .replace(/\+/g, '');
  }

  function maxLength(num, limit) {
    return num.replace(/-|\./g, '').length > limit;
  }

  function validNumber(num) {
    return (
      (typeof parseFloat(state.current) === 'number' &&
        state.current.length > 0) ||
      parseInt(num, 10) > 0
    );
  }

  /**
   * UPDATES STATE OF APPLICATION
   */
  function updateState(props = {}) {
    state = Object.assign({}, state, props);
  }
};
