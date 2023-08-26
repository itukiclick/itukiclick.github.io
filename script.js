let itsukiCount = 0;
const itsukiCountDisplay = document.getElementById("itsukiCount");
const cookieImage = document.getElementById("cookieImage");
const facilityList = document.getElementById("facilityList");

// セーブデータのキー
const saveKey = "itsukiClickerSave";

// 以前のセーブデータを読み込む
const savedData = JSON.parse(localStorage.getItem(saveKey));
if (savedData) {
    itsukiCount = savedData.itsukiCount || itsukiCount;
}

const facilities = [
    { name: "はるや", cost: 20, baseIncome: 2, owned: 0 },
    { name: "そふと", cost: 80, baseIncome: 10, owned: 0 },
    { name: "いつき農場", cost: 110, baseIncome: 20, owned: 0 }
];

cookieImage.addEventListener("click", () => {
    itsukiCount++;
    updateDisplay();
    saveGame(); // クリックしたらセーブデータを保存
});

function updateDisplay() {
    itsukiCountDisplay.textContent = itsukiCount;
    updateFacilityList();
}


function updateFacilityList() {
    facilityList.innerHTML = "<h2>施設一覧</h2>";
    for (const facility of facilities) {
        const facilityButton = document.createElement("button");
        facilityButton.textContent = `${facility.name} (${facility.cost} ポイント) - 所有数: ${facility.owned}`;
        facilityButton.addEventListener("click", () => {
            purchaseFacility(facility);
        });
        facilityList.appendChild(facilityButton);
    }
}

function purchaseFacility(facility) {
    if (itsukiCount >= facility.cost) {
        itsukiCount -= facility.cost;
        facility.owned++;
        startGeneratingIncome(facility);
        updateDisplay();
        saveGame(); // 施設を購入したらセーブデータを保存
    }
}

function startGeneratingIncome(facility) {
    setInterval(() => {
        itsukiCount += facility.baseIncome * facility.owned;
        updateDisplay();
    }, 1000);
}

function saveGame() {
    const dataToSave = {
        itsukiCount: itsukiCount
    };
    localStorage.setItem(saveKey, JSON.stringify(dataToSave));
}

// ゲームの開始時に施設一覧を表示
updateFacilityList();
