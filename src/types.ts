export interface HeartData {
  age: number;
  sex: number; // 1: male, 0: female
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // serum cholestoral
  fbs: number; // fasting blood sugar > 120 mg/dl
  restecg: number; // resting electrocardiographic results (0-2)
  thalach: number; // maximum heart rate achieved
  exang: number; // exercise induced angina
  oldpeak: number; // ST depression induced by exercise relative to rest
  slope: number; // the slope of the peak exercise ST segment
  ca: number; // number of major vessels (0-3)
  thal: number; // 1 = normal; 2 = fixed defect; 3 = reversable defect
}

export interface PredictionResult {
  probability: number;
  risk: "High" | "Low";
  confidence: number;
  timestamp: string;
}
