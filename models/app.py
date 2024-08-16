import re
from flask import Flask, request, jsonify
# import os
# import cv2

app = Flask(__name__)

positive_words = [
    "great", "love", "helpful", "excellent", "like", "good", "cool", "wow", "amazing",
    "fantastic", "awesome", "wonderful", "terrific", "superb", "impressive", "outstanding",
    "pleased", "satisfied", "happy", "delighted", "brilliant", "super", "fabulous", "nice",
    "remarkable", "perfect", "fine", "phenomenal", "splendid", "exquisite", "marvelous",
    "exceptional", "top-notch", "stellar", "admirable", "incredible", "greatest", "thrilled",
    "enjoyable", "lovely", "exhilarating", "delicious", "fun", "grateful", "refreshing",
    "thx", "gr8", "luv", "thnx", "hppy", "awsm", "thk", "thnks", "thnk", "grateful", "gratitude",
    "gracias", "grazie", "merci", "fabb"
]

negative_words = [
    "terrible", "frustrated", "not sure", "confusing", "bad", "not nice", "didn't", "not", "did not",
    "awful", "horrible", "disappointed", "unpleasant", "dreadful", "inferior", "poor", "unfortunate",
    "annoying", "frustrating", "displeased", "miserable", "upset", "disgusting", "lousy", "unhappy",
    "dislike", "repulsive", "unsatisfactory", "unimpressed", "hated", "regret", "irritating",
    "distasteful", "disheartening", "unsuitable", "unfavorable", "gross", "depressing", "troubled",
    "appalling", "discomforting", "deficient", "detestable", "unwanted", "unfortunate", "unbearable",
    "tho", "sux", "ugh", "smh", "meh", "grr", "dis", "disappointed", "disappointing", "disappointment",
    "ehhh", "um eww"
]



def categorize_feedback(feedback):
    """Categorizes feedback as negative or positive."""
    feedback = feedback.lower()
    if any(word in feedback for word in positive_words):
        return "positive"
    elif any(word in feedback for word in negative_words):
        return "negative"
    else:
        return "neutral"

def reply_to_feedback(category):
    """Replies to feedback with a thank you or an apology."""
    if category == "positive":
        return "Thank you for your feedback! It means a lot to us that you enjoyed our services."
    else:
        return "Hii! Thank you for your feedback! It's really important to us. We will work on it and make sure you have a better experience next time."

@app.route("/feedback", methods=["POST"])
def feedback():
    feedback = request.form.get("feedback") or request.json.get("feedback")
    if feedback is None:
        return jsonify({"error": "Invalid request"}), 400
    category = categorize_feedback(feedback)
    reply = reply_to_feedback(category)
    return jsonify({"category": category, "reply": reply})

if __name__ == "__main__":
    app.run(debug=True)