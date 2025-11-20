from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Sales Forecasting API",
    version="1.0.0",
)

# CORS - sab origin allowed (demo / project ke liye theek hai)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production me restrict kar sakte ho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    productName: str
    category: str
    unitPrice: float
    discount: float
    region: str
    season: str

class PredictionResponse(BaseModel):
    predictedSales: float
    confidenceLevel: str
    growthTrend: float  # percentage
    insights: list[str]
    recommendation: str

def simple_sales_model(data: PredictionRequest) -> PredictionResponse:
    # Base demand by category
    category_base = {
        "electronics": 32000,
        "clothing": 18000,
        "grocery": 25000,
        "furniture": 22000,
    }
    base = category_base.get(data.category.lower(), 20000)

    # Price effect: high price -> kam demand
    price_factor = max(0.5, min(1.5, 1.0 - (data.unitPrice - 100) / 1000))

    # Discount effect (20% discount ~ 16% zyada sales)
    discount_factor = 1 + (data.discount / 100) * 0.8

    # Region multiplier
    region_factor = {
        "north": 1.05,
        "south": 0.95,
        "east": 1.00,
        "west": 1.10,
    }.get(data.region.lower(), 1.0)

    # Seasonality
    season_factor = {
        "summer": 1.10,
        "winter": 1.15,
        "spring": 1.05,
        "autumn": 0.9,
        "monsoon": 1.08,
    }.get(data.season.lower(), 1.0)

    predicted = base * price_factor * discount_factor * region_factor * season_factor

    # Growth trend & confidence (heuristic)
    if discount_factor > 1.1 and season_factor >= 1.1:
        growth_trend = 0.20
        confidence = "High"
    elif discount_factor > 1.05:
        growth_trend = 0.12
        confidence = "Medium"
    else:
        growth_trend = 0.05
        confidence = "Medium"

    insights: list[str] = []

    if data.discount >= 20:
        insights.append("Strong promotional impact due to high discount.")
    elif data.discount > 0:
        insights.append("Moderate uplift expected from discount strategy.")
    else:
        insights.append("No discount applied; rely on baseline demand and seasonality.")

    if season_factor > 1.05:
        insights.append("Strong seasonal demand expected in this period.")
    elif season_factor < 1.0:
        insights.append("Off-season period; consider targeted campaigns.")

    if region_factor > 1.05:
        insights.append("Region shows above-average performance historically.")
    elif region_factor < 1.0:
        insights.append("Region historically underperforms; conservative forecast applied.")

    if price_factor < 0.8:
        insights.append("High unit price may limit demand; consider adjusting pricing.")
    elif price_factor > 1.2:
        insights.append("Competitive pricing likely to support higher volume.")

    recommendation = "Increase stock levels to meet predicted demand."
    if growth_trend < 0.08:
        recommendation = "Maintain current stock levels and monitor performance."
    if growth_trend >= 0.18:
        recommendation = "Strong growth expected; aggressively increase stock and marketing."

    return PredictionResponse(
        predictedSales=round(predicted, 2),
        confidenceLevel=confidence,
        growthTrend=round(growth_trend * 100, 1),  # %
        insights=insights,
        recommendation=recommendation,
    )

@app.get("/")
def root():
    return {"status": "ok", "message": "Sales forecasting API is running."}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    return simple_sales_model(request)
