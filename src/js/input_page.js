document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').addEventListener('change', changeYear);

  document.querySelector('.add-button').addEventListener('click', addSalaryField);
  document.querySelectorAll('.salary-section input[id="paymentAmount"], .salary-section input[id="withholdingTax"], .salary-section input[id="socialInsurance"]').forEach(input => {
    input.addEventListener('change', updateTotal);
  });

  document.getElementById('businessIncome').addEventListener('change', updateTotal);
  document.getElementById('businessIncome').addEventListener('input', validateNumber(businessIncome));
  document.getElementById('expenseAmount').addEventListener('change', updateTotal);
  document.getElementById('expenseAmountAdjust').addEventListener('change', updateTotal);
  document.getElementById('expenseAmountAdjust').addEventListener('change', clearExpenseAmountAdjust);
  document.getElementById('blueReturnSpecialSeduction').addEventListener('change', updateTotal);

  document.getElementById('nationalHealthInsurance').addEventListener('change', updateTotal);
  document.getElementById('nationalPension').addEventListener('change', updateTotal);
  document.getElementById('smallBusinessMutualAidPremiumDeduction').addEventListener('change', updateTotal);
  document.getElementById('newLifeInsurance').addEventListener('change', updateTotal);
  document.getElementById('careInsurance').addEventListener('change', updateTotal);
  document.getElementById('basicDeduction').addEventListener('change', updateTotal);
  document.getElementById('medicalExpense').addEventListener('change', updateTotal);
  document.getElementById('donation').addEventListener('change', updateTotal);
  document.getElementById('dependentDeduction').addEventListener('change', updateTotal);
  document.getElementById('spouseSpecialDeductionDiv').addEventListener('change', updateTotal);
  document.getElementById('spouseSpecialDeduction').addEventListener('change', updateTotal);
  document.getElementById('spouseIncome').addEventListener('change', updateTotal);

  document.getElementById('fixedAmountTaxReductionDiv').addEventListener('change', updateTotal);

  document.getElementById('saveButton').addEventListener('click', saveData);
  document.getElementById('addButton').addEventListener('click', addData);

  changeYear();
  setDefaultValuesFromLocalStorage();
});

// 給与欄追加
function addSalaryField() {
  const salarySection = document.querySelector('.salary-section');
  const salaryField = document.createElement('div');
  salaryField.innerHTML = `
    <div class="salary-row">
    <label for="companyName">会社名：</label>
    <input type="text" id="companyName" class="input-text">
    <label for="paymentAmount">㋔支払金額：</label>
    <input type="text" id="paymentAmount" class="input-amount" oninput="validateNumber(this)">
    <label for="withholdingTax">[a]源泉徴収税額：</label>
    <input type="text" id="withholdingTax" class="input-amount" oninput="validateNumber(this)">
    <label for="socialInsurance">[b]社会保険料の金額：</label>
    <input type="text" id="socialInsurance" class="input-amount" oninput="validateNumber(this)">
    </div>
  `;
  salarySection.appendChild(salaryField);
  document.querySelectorAll('.salary-section input[id="paymentAmount"], .salary-section input[id="withholdingTax"], .salary-section input[id="socialInsurance"]').forEach(input => {
      input.addEventListener('change', updateTotal);
    });
}

// 入力制限（数字のみ入力を受け付ける）
function validateNumber(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
}

// 入力制限（数字とマイナスのみ入力を受け付ける）
function validateNumberAndMinus(input) {
  input.value = input.value.replace(/[^0-9-]/g, '');
}

function clearExpenseAmountAdjust() {
  document.getElementById('expenseAmountAdjust').value = null;
}

// 自動計算
function updateTotal() {

  const year = document.getElementById('year').value;

  // 収入
  let totalIncome = 0;
  let totalBusinessIncome = 0;
  const businessIncomeAmount = document.getElementById('businessIncome');
  totalBusinessIncome += parseFloat(businessIncomeAmount.value) || 0;
  totalIncome += totalBusinessIncome;

  // 給与
  const paymentAmounts = document.querySelectorAll('.salary-section input[id="paymentAmount"]');
  let salaryTotal = 0;
  paymentAmounts.forEach(input => {
    salaryTotal += parseFloat(input.value) ||   0;
  });
  totalIncome += salaryTotal;
  const salaryAfterDeductionAmount = calculateSalaryAfterDeductionAmount(salaryTotal)
  document.getElementById('totalSalary').value = formatNumber(salaryTotal);
  document.getElementById('salaryAfterDeductionAmount').value = formatNumber(salaryAfterDeductionAmount);
  document.getElementById('totalIncome').value = formatNumber(totalIncome);

  // 経費
  const expenseAmount = document.getElementById('expenseAmount');
  const expenseAmountAdjust = document.getElementById('expenseAmountAdjust');
  const adjustedExpenseAmount = parseFloat(expenseAmount.value) + (parseFloat(expenseAmountAdjust.value) || 0);
  expenseAmount.value = adjustedExpenseAmount || null;
  let expenseTotal = 0;
  expenseTotal += parseFloat(expenseAmount.value) || 0;
  const blueReturnSpecialSeductionAmount = document.getElementById('blueReturnSpecialSeduction');
  expenseTotal += parseFloat(blueReturnSpecialSeductionAmount.value) || 0;

  let businessIncomeProfit = parseFloat(businessIncomeAmount.value) || 0;
  businessIncomeProfit -= expenseTotal;
  document.getElementById('businessIncomeProfit').value = formatNumber(businessIncomeProfit);

  const totalOperatingProfit = (totalBusinessIncome - expenseTotal) + salaryAfterDeductionAmount;
  document.getElementById('totalOperatingProfit').value = formatNumber(totalOperatingProfit);

  // 控除
  let totalDeduction = 0;
  let totalSocialInsurance = 0;
  let totalSalarySocialInsurance = 0;
  const salarySocialInsuranceAmounts = document.querySelectorAll('.salary-section input[id="socialInsurance"]');
  salarySocialInsuranceAmounts.forEach(input => {
    totalSalarySocialInsurance += parseFloat(input.value) || 0;
  });
  document.getElementById('totalSalarySocialInsurance').value = formatNumber(totalSalarySocialInsurance);
  totalSocialInsurance += totalSalarySocialInsurance;
  const nationalHealthInsurance = document.getElementById('nationalHealthInsurance');
  totalSocialInsurance += parseFloat(nationalHealthInsurance.value) || 0;
  const nationalPension = document.getElementById('nationalPension');
  totalSocialInsurance += parseFloat(nationalPension.value) || 0;
  document.getElementById('totalSocialInsurance').value = formatNumber(totalSocialInsurance);
  totalDeduction += totalSocialInsurance;

  const smallBusinessMutualAidPremiumDeduction = document.getElementById('smallBusinessMutualAidPremiumDeduction');
  totalDeduction += parseFloat(smallBusinessMutualAidPremiumDeduction.value) || 0;

  const newLifeInsurance = document.getElementById('newLifeInsurance');
  totalDeduction += parseFloat(newLifeInsurance.value) || 0;
  const careInsurance = document.getElementById('careInsurance');
  totalDeduction += parseFloat(careInsurance.value) || 0;

  const basicDeduction = calculateBasicDeduction(totalOperatingProfit);
  document.getElementById('basicDeduction').value = basicDeduction;
  document.getElementById('displayBasicDeduction').value = formatNumber(basicDeduction);
  totalDeduction += basicDeduction;
  const medicalExpense = document.getElementById('medicalExpense');
  totalDeduction += parseFloat(medicalExpense.value) || 0;
  const donation = document.getElementById('donation');
  totalDeduction += parseFloat(donation.value) || 0;
  if (document.getElementById('spouseSpecialDeductionDiv').value === '1') {
    const spouseSpecialDeduction = calculateSpouseDeduction(totalOperatingProfit, document.getElementById('spouseIncome').value);
    document.getElementById('spouseSpecialDeduction').value = spouseSpecialDeduction;
    document.getElementById('displaySpouseSpecialDeduction').value = formatNumber(spouseSpecialDeduction);
    totalDeduction += parseFloat(spouseSpecialDeduction) || 0;
  } else {
    document.getElementById('spouseSpecialDeduction').value = 0;
    document.getElementById('displaySpouseSpecialDeduction').value = '';
  }
  totalDeduction += parseFloat(spouseSpecialDeduction) || 0;
  const dependentDeduction = document.getElementById('dependentDeduction');
  totalDeduction += parseFloat(dependentDeduction.value) || 0;
  document.getElementById('totalDeduction').value = formatNumber(totalDeduction);

  // 税額
  const beforeTaxableIncomeAmount = totalOperatingProfit - totalDeduction
  const taxableIncomeAmount = Math.floor(beforeTaxableIncomeAmount / 1000) * 1000;
  document.getElementById('taxableIncomeAmount').value = formatNumber(taxableIncomeAmount);
  let calculatedIncomeTax = calculateTax(taxableIncomeAmount);
  document.getElementById('calculatedIncomeTax').value = formatNumber(calculatedIncomeTax);

  if (year == '2024') {
    const fixedAmountTaxReduction = (parseFloat(document.getElementById('fixedAmountTaxReductionDiv').value) || 0) * 30000;
    document.getElementById('fixedAmountTaxReduction').value = formatNumber(fixedAmountTaxReduction);
    calculatedIncomeTax -= fixedAmountTaxReduction;
  } else {
    document.getElementById('fixedAmountTaxReduction').value = 0;
  }

  const reconstructionSpecialIncomeTax = calculateReconstructionSpecialIncomeTaxAmount(calculatedIncomeTax);
  document.getElementById('reconstructionSpecialIncomeTax').value = formatNumber(reconstructionSpecialIncomeTax);

  const totalTax = calculatedIncomeTax + reconstructionSpecialIncomeTax;
  document.getElementById('totalTax').value = formatNumber(totalTax);

  const totalWithholdingTax = calculateTotalWithholdingTax();
  document.getElementById('totalWithholdingTax').value = formatNumber(totalWithholdingTax);

  const declaredTax = Math.floor((totalTax - totalWithholdingTax) / 100) * 100;
  document.getElementById('declaredTax').value = formatNumber(declaredTax);
}

// 給与控除額計算
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1410.htm
function calculateSalaryAfterDeductionAmount(salary) {
  let result;
  if (salary <= 550999) {
    return 0;
  } else if (salary >= 551000 && salary <= 1618999) {
    return salary - 550000;
  } else if (salary >= 1619000 && salary <= 1619999) {
    return 1069000;
  } else if (salary >= 1620000 && salary <= 1621999) {
    return 1070000;
  } else if (salary >= 1622000 && salary <= 1623999) {
    return 1072000;
  } else if (salary >= 1624000 && salary <= 1627999) {
    return 1074000;
  } else if (salary >= 1628000 && salary <= 1799999) {
    const A = Math.floor(salary / 4000) * 1000;
    return A * 2.4 + 100000;
  } else if (salary >= 1800000 && salary <= 3599999) {
    const A = Math.floor(salary / 4000) * 1000;
    return A * 2.8 - 80000;
  } else if (salary >= 3600000 && salary <= 6599999) {
    const A = Math.floor(salary / 4000) * 1000;
    return A * 3.2 - 440000;
  } else if (salary >= 6600000 && salary <= 8499999) {
    return salary * 0.9 - 1100000;
  } else if (salary >= 8500000) {
    return salary - 1950000;
  }
}  

// 基礎控除の計算
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1199.htm
function calculateBasicDeduction(totalIncome) {
  if (totalIncome <= 24000000) {
    return 480000;
  } else if (totalIncome > 24000000 && totalIncome <= 24500000) {
    return 320000;
  } else if (totalIncome > 24500000 && totalIncome <= 25000000) {
    return 160000;
  } else {
    return 0;
  }
}

// 配偶者控除の計算
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm
function calculateSpouseDeduction(totalIncome, spouseIncome) {

  if (totalIncome >= 10000000) {
    return 0;
  }

  // 配偶者の所得が48万円越の場合は配偶者(特別)控除を適用
  if (spouseIncome > 480000) {
    return calculateSpouseSpecialDeduction(totalIncome, spouseIncome);
  }

  if (totalIncome <= 9000000) {
    return 380000;
  } else if (totalIncome <= 9500000) {
    return 260000;
  } else if (totalIncome <= 10000000) {
    return 130000;
  }

}

// 配偶者(特別)控除の計算
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1195.htm
function calculateSpouseSpecialDeduction(totalIncome, spouseIncome) {

  // 控除額テーブル
  const deductionTable = [
    { spouseMin: 480000, spouseMax: 950000, deductions: [380000, 260000, 130000] },
    { spouseMin: 950000, spouseMax: 1000000, deductions: [360000, 240000, 120000] },
    { spouseMin: 1000000, spouseMax: 1050000, deductions: [310000, 210000, 110000] },
    { spouseMin: 1050000, spouseMax: 1100000, deductions: [260000, 180000, 90000] },
    { spouseMin: 1100000, spouseMax: 1150000, deductions: [210000, 140000, 70000] },
    { spouseMin: 1150000, spouseMax: 1200000, deductions: [160000, 110000, 60000] },
    { spouseMin: 1200000, spouseMax: 1250000, deductions: [110000, 80000, 40000] },
    { spouseMin: 1250000, spouseMax: 1300000, deductions: [60000, 40000, 20000] },
    { spouseMin: 1300000, spouseMax: 1330000, deductions: [30000, 20000, 10000] }
  ];

  // 納税者の所得区分に基づくインデックスの計算
  let incomeIndex = 0;
  if (totalIncome <= 9000000) {
    incomeIndex = 0;
  } else if (totalIncome <= 9500000) {
    incomeIndex = 1;
  } else if (totalIncome <= 10000000) {
    incomeIndex = 2;
  } else {
    // 所得が1000万円超える場合は控除なし
    return 0;
  }
  // 配偶者の所得金額を基に控除額を取得
  for (const row of deductionTable) {
    if (row.spouseMin < spouseIncome && spouseIncome <= row.spouseMax) {
        return row.deductions[incomeIndex];
    }
  }

  // 配偶者の所得がテーブル外の場合、控除なし
  return 0;
}

// 所得税の税額計算
// https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2260.htm
function calculateTax(taxableIncomeAmount) {
  if (taxableIncomeAmount >= 1000 && taxableIncomeAmount <= 1949000) {
    return taxableIncomeAmount * 0.05;
  } else if (taxableIncomeAmount >= 1950000 && taxableIncomeAmount <= 3299000) {
    return taxableIncomeAmount * 0.10 - 97500;
  } else if (taxableIncomeAmount >= 3300000 && taxableIncomeAmount <= 6949000) {
    return taxableIncomeAmount * 0.20 - 427500;
  } else if (taxableIncomeAmount >= 6950000 && taxableIncomeAmount <= 8999000) {
    return taxableIncomeAmount * 0.23 - 636000;
  } else if (taxableIncomeAmount >= 9000000 && taxableIncomeAmount <= 17999000) {
    return taxableIncomeAmount * 0.33 - 1536000;
  } else if (taxableIncomeAmount >= 18000000 && taxableIncomeAmount <= 39999000) {
    return taxableIncomeAmount * 0.40 - 2796000;
  } else if (taxableIncomeAmount >= 40000000) {
    return taxableIncomeAmount * 0.45 - 4796000;
  }
  return 0;
}

// 復興特別所得税額の税額計算
function calculateReconstructionSpecialIncomeTaxAmount(calculatedIncomeTax) {
  return Math.floor(calculatedIncomeTax * 0.021);
}

// 源泉徴収額の税額計算
function calculateTotalWithholdingTax() {
  let totalWithholdingTax = 0;
  const salaryWithholdingTax = document.querySelectorAll('.salary-section input[id="withholdingTax"]');
  salaryWithholdingTax.forEach(input => {
    totalWithholdingTax += parseFloat(input.value) || 0;
  });
  return totalWithholdingTax;
}

// 初期表示
function setDefaultValuesFromLocalStorage() {
  // ローカルストレージからデータを取得
  const finalTaxData = localStorage.getItem('finalTaxData');
  if (!finalTaxData) {
    console.log('No data found in local storage.');
    document.getElementById('saveButton').disabled = true;
    return;
  }

  // URLからindexパラメータを取得
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get('index');

  // indexが指定されていない場合は何もしない
  if (!index) {
    console.log('No index parameter found in URL.');
    return;
  }

  // JSONデータを解析
  const data = JSON.parse(finalTaxData);
  // 配列のpの値を取得
  const lastItem = data[index - 1];

  // 入力フォームの各フィールドに最後に記録された値を設定
  document.getElementById('year').value = lastItem.year || '';
  document.getElementById('title').value = lastItem.title || '';
  document.getElementById('businessIncome').value = lastItem.businessIncome || '';
  document.getElementById('expenseAmount').value = lastItem.expenseAmount || '';
  document.getElementById('blueReturnSpecialSeduction').value = lastItem.blueReturnSpecialSeduction || '';
  document.getElementById('nationalHealthInsurance').value = lastItem.nationalHealthInsurance || '';
  document.getElementById('nationalPension').value = lastItem.nationalPension || '';
  document.getElementById('smallBusinessMutualAidPremiumDeduction').value = lastItem.smallBusinessMutualAidPremiumDeduction || '';
  document.getElementById('newLifeInsurance').value = lastItem.newLifeInsurance || '';
  document.getElementById('spouseSpecialDeductionDiv').value = lastItem.spouseSpecialDeductionDiv || '';
  document.getElementById('spouseIncome').value = lastItem.spouseIncome || '';
  document.getElementById('dependentDeduction').value = lastItem.dependentDeduction || '';
  document.getElementById('basicDeduction').value = lastItem.basicDeduction || '';
  document.getElementById('careInsurance').value = lastItem.careInsurance || '';
  document.getElementById('medicalExpense').value = lastItem.medicalExpense || '';
  document.getElementById('donation').value = lastItem.donation || '';

  document.getElementById('fixedAmountTaxReductionDiv').value = lastItem.fixedAmountTaxReductionDiv || '';

  document.getElementById('companyName').value = lastItem.donation || '';
  document.getElementById('paymentAmount').value = lastItem.donation || '';
  document.getElementById('withholdingTax').value = lastItem.donation || '';
  document.getElementById('socialInsurance').value = lastItem.donation || '';

  const salaries = lastItem.salaries;

  salaries.forEach((salary, index) => {
    const newRow = document.querySelector('.salary-section .salary-row:last-child');

    newRow.querySelector('input[id="companyName"]').value = salary.companyName;
    newRow.querySelector('input[id="paymentAmount"]').value = salary.paymentAmount;
    newRow.querySelector('input[id="withholdingTax"]').value = salary.withholdingTax;
    newRow.querySelector('input[id="socialInsurance"]').value = salary.socialInsurance;
    if (index < salaries.length - 1) {
      addSalaryField();
    }
  });
}

// 入力データを取得
function getInputData() {
  // const formData = new FormData(document.querySelector('form'));
  const data = {
    year: document.getElementById('year').value,
    title: document.getElementById('title').value,
    businessIncome: document.getElementById('businessIncome').value,
    // businessCategory: document.getElementById('businessCategory').value,
    totalIncome: unFormatNumber(document.getElementById('totalIncome').value),
    salaries: [],
    expenseAmount: document.getElementById('expenseAmount').value,
    blueReturnSpecialSeduction: document.getElementById('blueReturnSpecialSeduction').value,
    // totalExpense: document.getElementById('totalExpense').value,
    businessIncomeProfit: unFormatNumber(document.getElementById('businessIncomeProfit').value),
    medicalExpense: document.getElementById('medicalExpense').value,
    salaryAfterDeductionAmount: unFormatNumber(document.getElementById('salaryAfterDeductionAmount').value),
    totalOperatingProfit: unFormatNumber(document.getElementById('totalOperatingProfit').value),
    totalSocialInsurance: unFormatNumber(document.getElementById('totalSocialInsurance').value),
    nationalHealthInsurance: document.getElementById('nationalHealthInsurance').value,
    nationalPension: document.getElementById('nationalPension').value,
    totalSalarySocialInsurance: unFormatNumber(document.getElementById('totalSalarySocialInsurance').value),
    smallBusinessMutualAidPremiumDeduction: document.getElementById('smallBusinessMutualAidPremiumDeduction').value,
    newLifeInsurance: document.getElementById('newLifeInsurance').value,
    careInsurance: document.getElementById('careInsurance').value,
    basicDeduction: document.getElementById('basicDeduction').value,
    donation: document.getElementById('donation').value,
    spouseSpecialDeductionDiv: document.getElementById('spouseSpecialDeductionDiv').value,
    spouseIncome: document.getElementById('spouseIncome').value,
    spouseSpecialDeduction: unFormatNumber(document.getElementById('spouseSpecialDeduction').value),
    dependentDeduction: document.getElementById('dependentDeduction').value,
    totalDeduction: unFormatNumber(document.getElementById('totalDeduction').value),
    taxableIncomeAmount: unFormatNumber(document.getElementById('taxableIncomeAmount').value),
    calculatedIncomeTax: unFormatNumber(document.getElementById('calculatedIncomeTax').value),
    fixedAmountTaxReductionDiv: document.getElementById('fixedAmountTaxReductionDiv').value,
    fixedAmountTaxReduction: unFormatNumber(document.getElementById('fixedAmountTaxReduction').value),
    reconstructionSpecialIncomeTax: unFormatNumber(document.getElementById('reconstructionSpecialIncomeTax').value),
    totalTax: unFormatNumber(document.getElementById('totalTax').value),
    totalWithholdingTax: unFormatNumber(document.getElementById('totalWithholdingTax').value),
    declaredTax: unFormatNumber(document.getElementById('declaredTax').value),
  };

  const salarySections = document.querySelectorAll('.salary-row');
    salarySections.forEach(section => {
    const companyName = section.querySelector('input[id="companyName"]').value;
    const paymentAmount = section.querySelector('input[id="paymentAmount"]').value;
    const withholdingTax = section.querySelector('input[id="withholdingTax"]').value;
    const socialInsurance = section.querySelector('input[id="socialInsurance"]').value;

    data.salaries.push({
      companyName,
      paymentAmount,
      withholdingTax,
      socialInsurance
    });
  });
  return data;
}

// データ記録（上書き）
function saveData() {
  // URLからindexパラメータを取得
  const urlParams = new URLSearchParams(window.location.search);
  const index = urlParams.get('index');

  //  ローカルストレージから既存のデータを取得
  const existingData = localStorage.getItem('finalTaxData');
  let finalTaxData = existingData ? JSON.parse(existingData) : [];

  // index番目の配列の値を書き換え
  if (index && finalTaxData[index - 1]) {
    finalTaxData[index -1] = getInputData();
    // データをローカルストレージに保存
    localStorage.setItem('finalTaxData', JSON.stringify(finalTaxData));
  } else {
    console.log('Invalid index or no data found at index index in local storage.');
    addData();
  }
  window.location.href = "result_page.html";
}

// データ追記
function addData() {

  data = getInputData();

  // ローカルストレージから既存のデータを取得
  const existingData = localStorage.getItem('finalTaxData');
  let finalTaxData = existingData ? JSON.parse(existingData) : [];

  // 新しいデータを配列に追加
  finalTaxData.push(data);

  // データをローカルストレージに保存
  localStorage.setItem('finalTaxData', JSON.stringify(finalTaxData));

  window.location.href = "result_page.html";
}

// 年度変更
function changeYear() {
  const year = document.getElementById('year').value;
  if (year === '2023') {
    document.getElementById('fixedAmountTaxReductionSection').style.display = 'none';
    document.getElementById('blueReturnSpecialSeductionLabel').textContent = '(58)';
    // document.getElementById('ReDeductionIncomeTaxLabel').textContent = '㊸再差引所得税額(基準所得税額)：';
    document.getElementById('reconstructionSpecialIncomeTaxLabel').textContent = '㊹';
    document.getElementById('totalTaxLabel').textContent = '㊺';
    document.getElementById('totalWithholdingTaxLabel').textContent = '㊽';
    document.getElementById('declaredTaxLabel').textContent = '㊾';
  } else if (year === '2024') {
    document.getElementById('fixedAmountTaxReductionSection').style.display = 'block';
    document.getElementById('blueReturnSpecialSeductionLabel').textContent = '(60)';
    // document.getElementById('ReDeductionIncomeTaxLabel').textContent = '㊸再差引所得税額：';
    document.getElementById('reconstructionSpecialIncomeTaxLabel').textContent = '㊻';
    document.getElementById('totalTaxLabel').textContent = '㊼';
    document.getElementById('totalWithholdingTaxLabel').textContent = '㊿';
    document.getElementById('declaredTaxLabel').textContent = '(51)';
  }
  updateTotal();
}
