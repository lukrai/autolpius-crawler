type CarModels = {
  [key: string]: {
    [key: string]: string;
  };
};

export const MODELS: CarModels = {
  'mercedes-benz': {
    c: "Mercedes-Benz C Class",
  },
  audi: {
    a4: "Audi A4",
  },
  bmw: {
    '3': "BMW 3 Series",
  },
  volkswagen: {
    passat: "Volkswagen Passat",
    golf: "Volkswagen Golf",
  },
  toyota: {
    corolla: "Toyota Corolla/Auris",
    auris: "Toyota Corolla/Auris",
    rav4: "Toyota RAV4",
  },
};

export const matchCarModel = (model: string | undefined) => {
  if (model == undefined) {
    return "";
  }

  const modelArray = model.trim().split(/\s+/);

  if (modelArray[0].toLowerCase() === "bmw") {
    const carMaker = modelArray[0].toLowerCase();
    const carModel = modelArray[1].toLowerCase();
    if (MODELS[carMaker][carModel[0]]) {
      return MODELS[carMaker][carModel[0]];
    }
    return model;
  }

  if (modelArray.length === 2) {
    const carMaker = modelArray[0].toLowerCase();
    const carModel = modelArray[1].toLowerCase();
    if (MODELS[carMaker][carModel]) {
      return MODELS[carMaker][carModel];
    }
    // regex which would handle cases like C100, C180...
    const regex = new RegExp(/[a-zA-Z]\d\d\d/, "i");
    if (regex.test(carModel) && MODELS[carMaker][carModel[0].toLowerCase()]) {
      return MODELS[carMaker][carModel[0].toLowerCase()];
    }
    return `${modelArray[0]} ${modelArray[1]}`;
  }

  return model.trim();
};

export const convertPriceTextToNumber = (priceText: string) => {
  if (!priceText) {
    return 0;
  }
  const priceTextSplit = priceText.split("€");
  if (priceTextSplit[0]) {
    const priceTextNumber = Number(priceTextSplit[0].replace(/[^0-9]/g, ""));
    if (priceText.includes("muitas")) {
      return Math.floor(priceTextNumber * 1.21);
    }
    return priceTextNumber;
  }
  return 0;
};
