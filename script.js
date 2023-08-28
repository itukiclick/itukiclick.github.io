let itsukiCount = 0;
let upgradeLevel = 0; // アップグレードレベル
let clickValue = 1;   // クリックの効果

const itsukiCountDisplay = document.getElementById("itsukiCount");
const cookieImage = document.getElementById("cookieImage");
const facilityList = document.getElementById("facilityList");
const unitNames = ['', '万', '億', '兆', '京', '垓', '秭', '穣', '溝', '澗', '正', '載', '極', '恒河沙'];
const clickSound = document.getElementById("clickSound"); // クリック効果音の要素を取得
const upgradeButton = document.getElementById("upgradeButton");
const upgradeCostDisplay = document.getElementById("upgradeCost"); // アップグレードコストを表示する要素

// セーブデータのキー
const saveKey = "itsukiClickerSave";

// 以前のセーブデータを読み込む
const savedData = JSON.parse(localStorage.getItem(saveKey));
if (savedData) {
    itsukiCount = savedData.itsukiCount || itsukiCount;
}

const facilities = [
    { name: "はるや", baseCost: 20, baseIncome: 2, owned: 0 },
    { name: "そふと", baseCost: 80, baseIncome: 10, owned: 0 },
    { name: "いつき農場", baseCost: 110, baseIncome: 20, owned: 0 },
    { name: "いつき工場", baseCost: 180, baseIncome: 50, owned: 0 },
    { name: "すばる", baseCost: 240, baseIncome: 80, owned: 0 }
];

upgradeButton.addEventListener("click", () => {
    performUpgrade();
});

cookieImage.addEventListener("click", () => {
    itsukiCount += clickValue;
    updateDisplay();
    clickSound.currentTime = 0; // 効果音を最初に戻す
    clickSound.play(); // クリック効果音を再生
    saveGame(); // クリックしたらセーブデータを保存
});

function increaseClickValue() {
    clickValue *= 4; // クリックの効果を増加
    upgradeLevel++; // アップグレードレベルを増加
}

function calculateUpgradeCost() {
    return Math.floor(10 * Math.pow(2, upgradeLevel));
}

function updateUpgradeCostDisplay() {
    const upgradeCost = calculateUpgradeCost();
    upgradeCostDisplay.textContent = formatNumberWithUnits(upgradeCost);
}

function resetGame() {
    localStorage.removeItem(saveKey);
    location.reload(); // ページをリロードして変更を反映
}

function performUpgrade() {
    const upgradeCost = calculateUpgradeCost();
    if (itsukiCount >= upgradeCost) {
        itsukiCount -= upgradeCost;
        increaseClickValue();
        updateDisplay();
        updateUpgradeCostDisplay(); // アップグレードコストの表示を更新
        saveGame();
    }
}

function formatNumberWithUnits(number) {
    if (isNaN(number)) {
        return `0 ${unitNames[0]}`;
    }

    const unitCount = Math.floor(Math.log10(number) / 4);
    const unitName = unitNames[unitCount];
    const formattedNumber = (number / Math.pow(10, unitCount * 4)).toFixed(0);
    return `${formattedNumber} ${unitName}`;
}

function updateDisplay() {
    itsukiCountDisplay.textContent = formatNumberWithUnits(itsukiCount);
    updateFacilityList();
}

function updateFacilityList() {
    facilityList.innerHTML = "<h2>施設一覧</h2>";
    for (const facility of facilities) {
        const facilityButton = document.createElement("button");
        facilityButton.textContent = `${facility.name} (${formatNumberWithUnits(facility.baseCost)} ポイント) - 所有数: ${facility.owned}`;
        facilityButton.addEventListener("click", () => {
            purchaseFacility(facility);
        });
        facilityList.appendChild(facilityButton);
    }
}

function purchaseFacility(facility) {
    if (itsukiCount >= facility.baseCost) {
        itsukiCount -= facility.baseCost;
        facility.owned++;
        facility.baseCost = Math.floor(facility.baseCost * Math.pow(2, facility.owned));
        startGeneratingIncome(facility);
        updateDisplay();
        saveGame();
    }
}

function startGeneratingIncome(facility) {
    setInterval(() => {
        itsukiCount += facility.baseIncome * facility.owned;
        updateDisplay();
        saveGame();
    }, 1000);
}

function saveGame() {
    const dataToSave = {
        itsukiCount: itsukiCount,
        facilities: facilities,
        upgradeLevel: upgradeLevel
    };
    localStorage.setItem(saveKey, JSON.stringify(dataToSave));
}

if (savedData) {
    itsukiCount = savedData.itsukiCount || itsukiCount;
    upgradeLevel = savedData.upgradeLevel || upgradeLevel;
    if (savedData.facilities) {
        for (let i = 0; i < savedData.facilities.length; i++) {
            facilities[i].owned = savedData.facilities[i].owned;
            facilities[i].baseCost = savedData.facilities[i].baseCost;
            if (facilities[i].owned > 0) {
                startGeneratingIncome(facilities[i]);
            }
        }
    }
    updateDisplay();
    updateFacilityList();
    updateUpgradeCostDisplay();
}
