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
