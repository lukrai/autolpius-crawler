type CarModels = {
  [key: string]: {
    [key: string]: string;
  };
};

export const MODELS: CarModels = {
  volkswagen: {
    passat: "Volkswagen Passat",
  },
  toyota: {
    corolla: "Toyota Corolla/Auris",
    auris: "Toyota Corolla/Auris",
  },
};

export const matchCarModel = (model: string | undefined) => {
  if (model == undefined) {
    return "";
  }

  const modelArray = model.trim().split(/\s+/);
  if (modelArray.length == 2) {
    const carMaker = modelArray[0].toLowerCase();
    const carModel = modelArray[1].toLowerCase();
    if (MODELS[carMaker][carModel]) {
      return MODELS[carMaker][carModel];
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
