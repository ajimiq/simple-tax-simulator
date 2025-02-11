// html要素を取得をしてSortableJSに設定します
const sortElement = document.getElementById('sort-table');
Sortable.create(sortElement);

// ローカルストレージからJSONデータを取得
const jsonData = JSON.parse(localStorage.getItem('finalTaxData'));

//   データが存在する場合、テーブルに追加
if (jsonData) {
  // jsonData.forEach(data => addDataToTable(data));
  addDataToTable(jsonData);
} else {
  console.log('ローカルストレージにデータが存在しません。');
}

document.getElementById('save').addEventListener('click', function() {
  updateLocalStorageFromTable();
});

document.getElementById('copyButton').addEventListener('click', function() {
  // ローカルストレージからJSONデータを取得
  const jsonData = localStorage.getItem('finalTaxData');
  if (jsonData) {
      // データをクリップボードにコピー
      navigator.clipboard.writeText(jsonData).then(function() {
      alert('JSONデータがクリップボードにコピーされました。');
    }).catch(function(err) {
      console.error('クリップボードへのコピーに失敗しました: ', err);
    });
  } else {
    alert('ローカルストレージにデータが存在しません。');
  }
});

// JSONファイルを選択したときのイベントリスナー
document.getElementById('jsonUpload').addEventListener('change', function(e) {
  const file = e.target.files[0];

  if (file && file.type === 'application/json') {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const jsonData = JSON.parse(e.target.result);

        // テーブルの内容をクリア
        const tableBody = document.getElementById('sort-table');
        while (tableBody.firstChild) {
          tableBody.removeChild(tableBody.firstChild);
        }

        // データをテーブルに追加
        addDataToTable(jsonData);
      } catch (error) {
        console.error('JSON解析に失敗しました:', error);
        alert('JSONファイルの形式が不正です。');
      }
    };
    
    reader.readAsText(file);
  } else {
    alert('JSONファイルのみを選択してください。');
  }
});

// アコーディオンを開閉する関数
function toggleAccordion(btn, panel) {
  if (panel.style.display === "block") {
    panel.style.display = "none";
    btn.innerHTML = "内訳を表示";
  } else {
    panel.style.display = "block";
    btn.innerHTML = "内訳を隠す";
  }
}

//   テーブルにデータを追加する関数
function addDataToTable(data) {
  let index = 0;
  data.forEach((item, index) => {
    index++;
    const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();

    // const drugCell = document.createElement('td');
    // const span = document.createElement('span');
    // span.className = 'material-symbols-outlined';
    // span.textContent = '';
    // drugCell.appendChild(span);
    // row.appendChild(drugCell);

    // 0.ドラッグ
    const dragCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = './images/drag_indicator_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png';
    img.width = 20; // 幅を100pxに設定
    img.height = 20; // 高さを100pxに設定
    dragCell.appendChild(img);
    row.appendChild(dragCell);

    // 1.削除ボタン
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
      // //  ローカルストレージからデータを削除
      // data.splice(index - 1, 1);
      // localStorage.setItem('finalTaxData', JSON.stringify(data));
      //  テーブルから行を削除
      tableBody.removeChild(row);
      disabledButton('copyButton');
      enabledButton('save');
    });
    const deleteCell = document.createElement('td');
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    // 2.編集ボタン
    const editButton = document.createElement('button');
    editButton.textContent = '編集';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => {
      // GETパラメータ p  に行番号を設定して input_page.html  に遷移
      window.location.href = `input_page.html?index=${index}`;
    });
    const editCell = document.createElement('td');
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    // 3.ラベル
    const titleCell = row.insertCell();
    titleCell.textContent = item.title;

    // 4.収入と内訳
    const totalIncomeCell = row.insertCell();
    totalIncomeCell.textContent = item.totalIncome;
    const incomeAccordionBtn = document.createElement('button');
    incomeAccordionBtn.className = 'accordion';
    incomeAccordionBtn.innerHTML = '内訳を表示';
    incomeAccordionBtn.onclick = function() { toggleAccordion(this, incomeDetailsPanel); };
    totalIncomeCell.appendChild(incomeAccordionBtn);
    const incomeDetailsPanel = document.createElement('div');
    incomeDetailsPanel.className = 'accordion-panel';
    totalIncomeCell.appendChild(incomeDetailsPanel);
    totalIncomeCell.className = 'amount';

    // 収入の内訳をアコーディオンに追加
    const incomeDetail = document.createElement('p');
    incomeDetail.classList.add('accordion-detail');
    incomeDetail.textContent = `事業収入: ${formatNumber(item.businessIncome)}`;
    incomeDetailsPanel.appendChild(incomeDetail.cloneNode(true));
    let existSalaryPaymentAmount = false
    item.salaries.forEach(salary => {
      if (salary.paymentAmount) {
        existSalaryPaymentAmount = true
      }
    });
    if (existSalaryPaymentAmount) {
      incomeDetail.textContent = `給与`;
      incomeDetailsPanel.appendChild(incomeDetail.cloneNode(true));
      item.salaries.forEach(salary => {
        // 給与の内訳をアコーディオンに追加
        incomeDetail.textContent = `${salary.companyName}: ${formatNumber(salary.paymentAmount)}`;
        incomeDetailsPanel.appendChild(incomeDetail.cloneNode(true));
      });
    }
    incomeDetail.className = 'amount';

    // 5.経費と内訳
    const expenseAmountCell = row.insertCell();
    expenseAmountCell.textContent = formatNumber(item.expenseAmount);
    expenseAmountCell.className = 'amount';

    // 6.青色申告特別控除と内訳
    const expenseCategoryCell = row.insertCell();
    expenseCategoryCell.textContent = formatNumber(item.expenseCategory);
    expenseCategoryCell.className = 'amount';

    // 7.所得
    const totalOperatingProfitCell = row.insertCell();
    totalOperatingProfitCell.textContent = item.totalOperatingProfit;
    totalOperatingProfitCell.className = 'amount';

    // 8.控除
    const deductionCell = row.insertCell();
    deductionCell.textContent = item.totalDeduction;
    const deductionAccordionBtn = document.createElement('button');
    deductionAccordionBtn.className = 'accordion';
    deductionAccordionBtn.innerHTML = '内訳を表示';
    deductionAccordionBtn.onclick = function() { toggleAccordion(this, deductionDetailsPanel); };
    deductionCell.appendChild(deductionAccordionBtn);
    const deductionDetailsPanel = document.createElement('div');
    deductionDetailsPanel.className = 'accordion-panel';
    deductionCell.appendChild(deductionDetailsPanel);
    deductionCell.className = 'amount';

    // 控除の内訳をアコーディオンに追加
    const deductionDetail = document.createElement('p');
    deductionDetail.classList.add('accordion-detail');
    deductionDetail.textContent = `国民健康保険料: ${formatNumber(item.nationalHealthInsurance)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `国民年金: ${formatNumber(item.nationalPension)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    let existSalarySocialInsurance = false
    item.salaries.forEach(salary => {
      if (salary.socialInsurance) {
        existSalarySocialInsurance = true
      }
    });
    if (existSalarySocialInsurance) {
      deductionDetail.textContent = `社会保険料控除(給与)`;
      deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
      item.salaries.forEach(salary => {
        deductionDetail.textContent = `${salary.companyName}: ${formatNumber(salary.socialInsurance)}`;
        deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
      });
    }
    if (item.smallBusinessMutualAidPremiumDeduction) {
      deductionDetail.textContent = `小規模企業共済等掛金控除: ${formatNumber(item.smallBusinessMutualAidPremiumDeduction)}`;
      deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    }
    deductionDetail.textContent = `(新)生命保険料控除: ${formatNumber(item.newLifeInsurance)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `介護保険料控除: ${formatNumber(item.careInsurance)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `配偶者(特別)控除: ${formatNumber(item.spouseSpecialDeduction)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `扶養控除: ${formatNumber(item.dependentDeduction)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `基礎控除: ${formatNumber(item.basicDeduction)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `医療費控除: ${formatNumber(item.medicalExpense)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.textContent = `寄附金控除: ${formatNumber(item.donation)}`;
    deductionDetailsPanel.appendChild(deductionDetail.cloneNode(true));
    deductionDetail.className = 'amount';

    // 9.㉚課税所得[⑫ - ㉙]
    const taxableIncomeAmountCell = row.insertCell();
    taxableIncomeAmountCell.textContent = item.taxableIncomeAmount;
    taxableIncomeAmountCell.className = 'amount';

    // 10.㉛上の㉚に対する税額
    const taxCell = row.insertCell();
    taxCell.textContent = item.calculatedIncomeTax;
    taxCell.className = 'amount';

    // 11.㊹復興特別所得税額[㊸×2.1%]
    const reconstructionSpecialIncomeTaxAmountCell = row.insertCell();
    reconstructionSpecialIncomeTaxAmountCell.textContent = item.reconstructionSpecialIncomeTax;
    reconstructionSpecialIncomeTaxAmountCell.className = 'amount';

    // 12.㊺所得税及び復興特別所得税の額[㊸＋㊹]
    const tax2Cell = row.insertCell();
    tax2Cell.textContent = item.totalTax;
    tax2Cell.className = 'amount';

    // 13.㊽源泉徴収税額
    const withholdingTaxCell = row.insertCell();
    withholdingTaxCell.textContent = item.totalWithholdingTax;
    let existWithholdingTax = false
    item.salaries.forEach(salary => {
      if (salary.withholdingTaxDetailsPanel) {
        existWithholdingTax = true
      }
    });
    if (existWithholdingTax) {
      const withholdingTaxAccordionBtn = document.createElement('button');
      withholdingTaxAccordionBtn.className = 'accordion';
      withholdingTaxAccordionBtn.innerHTML = '内訳を表示';
      withholdingTaxAccordionBtn.onclick = function() { toggleAccordion(this, withholdingTaxDetailsPanel); };
      withholdingTaxCell.appendChild(withholdingTaxAccordionBtn);
      const withholdingTaxDetailsPanel = document.createElement('div');
      withholdingTaxDetailsPanel.className = 'accordion-panel';
      withholdingTaxCell.appendChild(withholdingTaxDetailsPanel);

      // 源泉徴収税額の内訳をアコーディオンに追加
      const withholdingTaxDetail = document.createElement('p');
      withholdingTaxDetail.classList.add('accordion-detail');
      item.salaries.forEach(salary => {
        withholdingTaxDetail.textContent = `${salary.companyName}: ${formatNumber(salary.withholdingTax)}`;
        withholdingTaxDetailsPanel.appendChild(withholdingTaxDetail.cloneNode(true));
      });
    }
    withholdingTaxCell.className = 'amount';

    // 14.㊾申告納税額[㊺－㊽]
    const declaredTaxCell = row.insertCell();
    declaredTaxCell.textContent = item.declaredTax;
    declaredTaxCell.className = 'emphasis-amount';

    // 15.json
    const hiddenTag = document.createElement('hidden');
    declaredTaxCell.parentNode.insertBefore(hiddenTag, declaredTaxCell.nextSibling);
    hiddenTag.className = 'json_' + index;
    hiddenTag.setAttribute('value', JSON.stringify(item));

    tableBody.appendChild(row);

    // ドラッグ&ドロップのイベントリスナーを追加
    var draggedRow = null;

    tableBody.addEventListener('dragstart', function(event) {
      // console.log(event);
      draggedRow = event.target;
      event.target.classList.add('dragging');
    });

    tableBody.addEventListener('dragend', function(event) {
      // console.log(event);
      event.target.classList.remove('dragging');
    });

    tableBody.addEventListener('dragover', function(event) {
      // console.log(event);
      event.preventDefault();
      var targetRow= event.target.closest('tr');
      if (targetRow && targetRow !== draggedRow) {
        targetRow.classList.add('drag-over');
      }
    });

    tableBody.addEventListener('dragleave', function(event) {
      // console.log(event);
      var targetRow= event.target.closest('tr');
      if (targetRow) {
        targetRow.classList.remove('drag-over');
      }
    });

    tableBody.addEventListener('drop', function(event) {
      // console.log(event);
      event.preventDefault();
      var targetRow = event.target.closest('tr');
      if (targetRow && draggedRow != targetRow) {
        // var rows = Array.from(tableBody.querySelectorAll('tr'));
        // var draggedIndex = rows.indexOf(draggedRow);
        // var targetIndex = rows.indexOf(targetRow);
        // if (draggedIndex < targetIndex) {
        //   targetRow.after(draggedRow);
        // } else {
        //   targetRow.before(draggedRow);
        // }
        targetRow.classList.remove('drag-over');
      }
      disabledButton('copyButton');
      enabledButton('save');
    });
  });
}

// テーブル内のhidden要素を取得し、ローカルストレージに書き直す関数
function updateLocalStorageFromTable() {
  // テーブル内のhidden要素を取得
  const hiddenElements = document.querySelectorAll('[class^="json_"]');

  // hidden要素の値を配列に格納
  const jsonDataArray = [];
  hiddenElements.forEach(element => {
    jsonDataArray.push(JSON.parse(element.getAttribute('value')));
  });

  // 配列をJSON文字列に変換
  const jsonString = JSON.stringify(jsonDataArray);
  // ローカルストレージに保存
  localStorage.setItem('finalTaxData', jsonString);

  console.log('テーブル内のJSONデータをローカルストレージに更新しました。');
}

function enabledButton(buttonName) {
  const copyButton = document.getElementById(buttonName);
  copyButton.disabled = false;
}

function disabledButton(buttonName) {
  const copyButton = document.getElementById(buttonName);
  copyButton.disabled = true;
}
