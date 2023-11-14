import random
import re

def get_feedback():
  """Returns a random piece of feedback."""
  feedback_list = ["This website is great!", "I love the information you provide.", "I found this website very helpful.", "I'm not sure I understand this.", "This website is terrible.", "I'm so frustrated with this website."]
  return random.choice(feedback_list)

def categorize_feedback(feedback):
  """Categorizes feedback as negative or positive."""
  negative_words = ["terrible", "frustrated", "not sure", "understand"]
  positive_words = ["great", "love", "helpful"]
  if any(word in feedback for word in negative_words):
    return "negative"
  elif any(word in feedback for word in positive_words):
    return "positive"
  else:
    return "neutral"

def reply_to_feedback(feedback, category):
  """Replies to feedback with a thank you or an apology."""
  if category == "positive":
    return "Thank you for your feedback!"
  else:
    return "We're sorry to hear that you're having trouble. Please let us know how we can help."

def main():
  feedback = get_feedback()
  category = categorize_feedback(feedback)
  reply = reply_to_feedback(feedback, category)
  print(f"Feedback: {feedback}")
  print(f"Category: {category}")
  print(f"Reply: {reply}")

if __name__ == "__main__":
  main()
