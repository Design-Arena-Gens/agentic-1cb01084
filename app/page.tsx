'use client';

import { useState, useEffect } from 'react';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('calculator-history', JSON.stringify(history));
    }
  }, [history]);

  const handleNumber = (num: string) => {
    setError(false);
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    setError(false);
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    setError(false);
    const currentValue = display;

    if (previousValue !== null && operation !== null && !isNewNumber) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result);
      setPreviousValue(result);
      setExpression(`${result} ${op}`);
    } else {
      setPreviousValue(currentValue);
      setExpression(`${currentValue} ${op}`);
    }

    setOperation(op);
    setIsNewNumber(true);
  };

  const calculate = (prev: string, current: string, op: string): string => {
    const prevNum = parseFloat(prev);
    const currentNum = parseFloat(current);

    if (isNaN(prevNum) || isNaN(currentNum)) return '0';

    let result: number;

    switch (op) {
      case '+':
        result = prevNum + currentNum;
        break;
      case '−':
        result = prevNum - currentNum;
        break;
      case '×':
        result = prevNum * currentNum;
        break;
      case '÷':
        if (currentNum === 0) {
          setError(true);
          return 'ERROR';
        }
        result = prevNum / currentNum;
        break;
      case '%':
        result = prevNum % currentNum;
        break;
      default:
        return current;
    }

    return Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
  };

  const handleEquals = () => {
    if (previousValue !== null && operation !== null) {
      const result = calculate(previousValue, display, operation);
      const fullExpression = `${expression} ${display}`;

      if (result !== 'ERROR') {
        const historyItem: HistoryItem = {
          expression: fullExpression,
          result: result,
          timestamp: Date.now(),
        };

        setHistory([historyItem, ...history].slice(0, 50));
      }

      setDisplay(result);
      setExpression(fullExpression + ' =');
      setPreviousValue(null);
      setOperation(null);
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setIsNewNumber(true);
    setError(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const handleSign = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setDisplay(item.result);
    setExpression('');
    setPreviousValue(null);
    setOperation(null);
    setIsNewNumber(true);
    setError(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculator-history');
  };

  return (
    <>
      <div className="deco-circle deco-1"></div>
      <div className="deco-circle deco-2"></div>
      <div className="deco-circle deco-3"></div>

      <div className="container">
        <div className="header">
          <h1>Neo-Brutal Calc</h1>
          <p>Bold • Raw • Unapologetic</p>
        </div>

        <div className="calculator">
          <div className="badge">V1.0</div>

          <div className="display-container">
            <div className="display">
              <div className="expression">{expression || '\u00A0'}</div>
              <div className={`result ${error ? 'error' : ''}`}>{display}</div>
            </div>
          </div>

          <div className="buttons">
            <button className="btn btn-clear" onClick={handleClear}>AC</button>
            <button className="btn btn-operator" onClick={handleSign}>±</button>
            <button className="btn btn-operator" onClick={() => handleOperator('%')}>%</button>
            <button className="btn btn-operator" onClick={() => handleOperator('÷')}>÷</button>

            <button className="btn btn-number" onClick={() => handleNumber('7')}>7</button>
            <button className="btn btn-number" onClick={() => handleNumber('8')}>8</button>
            <button className="btn btn-number" onClick={() => handleNumber('9')}>9</button>
            <button className="btn btn-operator" onClick={() => handleOperator('×')}>×</button>

            <button className="btn btn-number" onClick={() => handleNumber('4')}>4</button>
            <button className="btn btn-number" onClick={() => handleNumber('5')}>5</button>
            <button className="btn btn-number" onClick={() => handleNumber('6')}>6</button>
            <button className="btn btn-operator" onClick={() => handleOperator('−')}>−</button>

            <button className="btn btn-number" onClick={() => handleNumber('1')}>1</button>
            <button className="btn btn-number" onClick={() => handleNumber('2')}>2</button>
            <button className="btn btn-number" onClick={() => handleNumber('3')}>3</button>
            <button className="btn btn-operator" onClick={() => handleOperator('+')}>+</button>

            <button className="btn btn-number btn-zero" onClick={() => handleNumber('0')}>0</button>
            <button className="btn btn-decimal" onClick={handleDecimal}>.</button>
            <button className="btn btn-equals" onClick={handleEquals}>=</button>
          </div>
        </div>

        <div className="history-toggle">
          <button className="history-btn" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? '⬇ Hide History' : '⬆ Show History'}
          </button>
        </div>

        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h2>Calculation History</h2>
            </div>
            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">No calculations yet</div>
              ) : (
                <>
                  {history.map((item, index) => (
                    <div
                      key={item.timestamp}
                      className="history-item"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="history-item-expression">{item.expression}</div>
                      <div className="history-item-result">= {item.result}</div>
                    </div>
                  ))}
                  <button className="clear-history" onClick={clearHistory}>
                    Clear All History
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
