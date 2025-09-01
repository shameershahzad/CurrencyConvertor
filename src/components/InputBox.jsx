import React, { useState, useEffect } from 'react';
import './InputBox.css';

function InputBox() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState("PKR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [exchangeRate, setExchangeRate] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_quGT5J77xotqOoRNtx65iTuunTAKrlpVjeGJi7Op");
        if (!res.ok) {
          throw new Error("Network error: Unable to fetch exchange rates");
        }
        const result = await res.json();
        console.log(result)
        if (result.data) {
          setCurrencies(Object.keys(result.data));
          setExchangeRate(result.data);
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };
    fetchApi();
  }, []);

  const handleConvert = () => {
    if (exchangeRate[fromCurrency] && exchangeRate[toCurrency]) {
      const rate = exchangeRate[toCurrency].value / exchangeRate[fromCurrency].value;
      setConvertedAmount(amount * rate);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount || amount);
    setConvertedAmount(amount);
  };

  return (
   <>
  {error && <div className="error-msg">{error}</div>}
  <h1 className="converter-title">Currency Converter</h1>

  <div className="converter-card">
    {/* Glassy container */}
    <div className="glass-container">
      {/* From Section */}
      <div className="input-row">
        <div>
          <label>From</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Currency Type</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Swap Button in between */}
      <button className="swap-btn" onClick={handleSwap}>⇅ Swap</button>

      {/* To Section */}
      <div className="input-row">
        <div>
          <label>To</label>
          <input type="number" value={convertedAmount} readOnly />
        </div>
        <div>
          <label>Currency Type</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {/* Convert Button */}
    <button className="convert-btn" onClick={handleConvert}>
      Convert {fromCurrency} to {toCurrency}
    </button>
  </div>
</>

  );
}

export default InputBox;
