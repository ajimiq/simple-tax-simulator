# 簡易確定申告シミュレーター

## 特徴

- フリーランスエンジニア向けの簡易確定申告シミュレーターです。
    - ※フリーランスエンジニアに関連しそうな項目のみ対応しています。
- 計算結果を複数保存し、一覧表示できます。
- 収入・経費・控除額の違いによる税額の変動を比較できます。（並び替えも可能）
- 入力データはローカルストレージに保存され、インターネット上には送信されません。

## 注意事項
- 税計算方法は国税庁のホームページを参考に作成しましたが、計算結果の正確性・妥当性は保証できません。あくまで参考程度にご利用ください。
- 基本的な動作確認は行いましたが、詳細なテストは未実施です。異常値を入れた場合は正常に動かない可能性があります。
- 不具合があれば随時修正予定です。

## 使い方

ソースコード一式をダウンロードして、`src`下の`input_page.html`を開くだけで使えます。

下記サイトからも使用できます。  
https://ajimiq-20250215.s3.ap-northeast-1.amazonaws.com/simple-tax-simulator/input_page.html

### 入力ページ（`input_page.html`）
- 入力すると金額が自動計算されます。
- 「記録する（上書き）」を押下するとローカルストレージに上書き更新され、計算結果ページに遷移します。  
- 「記録する（追記）」を押下するとローカルストレージに追記され、計算結果ページに遷移します。  

### 計算結果ページ（`result_page.html`）
- ローカルストレージに保存されている計算結果の一覧が表示されます。
- 「編集」を押下すると該当行の入力ページに遷移します。
- 「削除」を押下すると行が削除されます。（この時点ではローカルストレージから削除されません）
- 行をドラッグ＆ドロップすることで並び替えできます。（この時点ではローカルストレージから削除されません）
- 「JSONファイル読み込み」を押下するとJSONファイルを読み取こむことができます。
- 「計算結果JSONをダウンロード」を押下するとローカルストレージの内容のJSONがダウンロードされます。  
- 「ローカルストレージに保存」を押下すると一覧の内容がローカルストレージに保存されます。（削除・並び替えした内容が保存されます）
- 「ローカルストレージの保存データをクリア」を押下するとローカルストレージがクリアされます。
