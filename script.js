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
    const facilityIndex = facilities.indexOf(facility);

    if (itsukiCount >= facility.cost) {
        itsukiCount -= facility.cost;
        facility.owned++;
        facility.cost = Math.floor(facility.baseCost * Math.pow(2, facility.owned)); // 施設を購入するたびに値段を2倍に更新
        startGeneratingIncome(facility);
        updateDisplay();
        saveGame(); // 施設を購入したらセーブデータを保存
    }
}

function startGeneratingIncome(facility) {
    setInterval(() => {
        itsukiCount += facility.baseIncome * facility.owned;
        updateDisplay();
        saveGame(); // 自動増加したらセーブデータを保存
    }, 1000);
}

function saveGame() {
    const dataToSave = {
        itsukiCount: itsukiCount,
        facilities: facilities
    };
    localStorage.setItem(saveKey, JSON.stringify(dataToSave));
}

if (savedData) {
    itsukiCount = savedData.itsukiCount || itsukiCount;
    if (savedData.facilities) {
        for (let i = 0; i < savedData.facilities.length; i++) {
            facilities[i].owned = savedData.facilities[i].owned;
            facilities[i].cost = savedData.facilities[i].cost;
            // セーブデータから読み込む際に、タイマーを再設定
            if (facilities[i].owned > 0) {
                startGeneratingIncome(facilities[i]);
            }
        }
    }
    updateDisplay();
    updateFacilityList();
}
