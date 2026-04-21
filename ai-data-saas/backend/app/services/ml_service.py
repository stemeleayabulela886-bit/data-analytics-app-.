from sklearn.linear_model import LinearRegression
import pandas as pd

def predict(df, target):
    df = df.select_dtypes(include="number")

    X = df.drop(columns=[target])
    y = df[target]

    model = LinearRegression()
    model.fit(X, y)

    predictions = model.predict(X)

    return predictions.tolist()
