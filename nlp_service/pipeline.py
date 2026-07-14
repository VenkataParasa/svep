import json
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# Ensure necessary NLTK models are downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')

# 15 Civic Terms Glossary with 8th-Grade Definitions
GLOSSARY = {
    "millage": "A tax rate applied to the assessed value of property.",
    "zoning": "Rules that decide how land and buildings can be used in a specific area.",
    "apportionment": "The process of dividing seats in a legislature based on population.",
    "ordinance": "A local law made by a city or town government.",
    "referendum": "A direct vote by the public on a specific political question or proposed law.",
    "incumbent": "The person who currently holds a political office.",
    "gerrymandering": "Drawing political boundaries to give one party an unfair advantage.",
    "eminent domain": "The government's power to take private property for public use, with payment.",
    "filibuster": "A long speech used in a legislature to delay or stop a vote on a bill.",
    "partisan": "Strongly supporting a specific political party.",
    "bipartisan": "Supported by members of two major political parties.",
    "constituent": "A voting member of a community who has the power to appoint or elect.",
    "subpoena": "A legal order requiring someone to appear in court or provide documents.",
    "veto": "The power of a president or governor to reject a bill proposed by a legislature.",
    "caucus": "A meeting of supporters or members of a specific political party or movement."
}

def extract_summary(text: str, sentence_count: int = 3) -> str:
    """
    Uses NLTK frequency distribution to deterministically extract the top N sentences.
    """
    if not text.strip():
        return ""
        
    sentences = sent_tokenize(text)
    
    # If the text is shorter than the requested summary, just return it
    if len(sentences) <= sentence_count:
        return " ".join(sentences)
        
    stop_words = set(stopwords.words("english"))
    words = word_tokenize(text.lower())
    
    # Calculate word frequencies (excluding stopwords and punctuation)
    freq_table = dict()
    for word in words:
        if word.isalnum() and word not in stop_words:
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1
                
    # Score sentences based on word frequencies
    sentence_scores = dict()
    for i, sentence in enumerate(sentences):
        sentence_word_count = len([w for w in word_tokenize(sentence.lower()) if w.isalnum()])
        if sentence_word_count == 0:
            continue
            
        for word in freq_table:
            if word in sentence.lower():
                if i in sentence_scores:
                    sentence_scores[i] += freq_table[word]
                else:
                    sentence_scores[i] = freq_table[word]
                    
        # Normalize score by sentence length to avoid punishing short, dense sentences
        if i in sentence_scores:
            sentence_scores[i] = sentence_scores[i] / sentence_word_count

    # Sort sentences by score (descending)
    sorted_scores = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Extract top N sentence indices, then sort them to preserve original chronological order
    top_indices = sorted([index for index, score in sorted_scores[:sentence_count]])
    
    summary_sentences = [sentences[i] for i in top_indices]
    return " ".join(summary_sentences)

def count_syllables(word: str) -> int:
    word = word.lower()
    if len(word) <= 3:
        return 1
    
    word = re.sub(r'e$', '', word)
    word = re.sub(r'es$', '', word)
    word = re.sub(r'ed$', '', word)
    
    syllables = len(re.findall(r'[aeiouy]+', word))
    return max(1, syllables)

def score_readability(text: str) -> dict:
    """
    Calculates Flesch-Kincaid Grade Level deterministically without external libraries.
    Flags manual review if grade is > 8.0.
    """
    if not text.strip():
        return {"score": 0.0, "requires_manual_review": False}
        
    sentences = sent_tokenize(text)
    words = [w for w in word_tokenize(text) if w.isalnum()]
    
    if not sentences or not words:
        return {"score": 0.0, "requires_manual_review": False}
        
    total_sentences = len(sentences)
    total_words = len(words)
    total_syllables = sum(count_syllables(w) for w in words)
    
    # Flesch-Kincaid Grade Level Formula
    grade = 0.39 * (total_words / total_sentences) + 11.8 * (total_syllables / total_words) - 15.59
    grade = round(grade, 1)
    
    return {
        "score": grade,
        "requires_manual_review": grade > 8.0
    }

def inject_glossary(text: str) -> str:
    """
    Scans the text for glossary terms and wraps them in HTML spans.
    Uses regex word boundaries for deterministic exact matching.
    """
    processed_text = text
    
    for term, definition in GLOSSARY.items():
        # HTML template matching the React tooltip component classes
        # Uses word boundary \b to prevent matching substrings (e.g. "zoning" inside "rezoning" if it was a word)
        # Using a lambda to preserve the original capitalization of the matched term
        
        # Escape definition quotes for safety in HTML attributes
        safe_definition = definition.replace('"', '&quot;')
        
        pattern = re.compile(rf"\b({re.escape(term)})\b", re.IGNORECASE)
        
        # Wrapper function to preserve case
        def replace_wrapper(match):
            original_word = match.group(1)
            return f'<span class="group relative inline-block cursor-help border-b border-dashed border-primary/50 text-primary hover:bg-primary/10 transition-colors">{original_word}<span class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">{safe_definition}</span></span>'
            
        processed_text = pattern.sub(replace_wrapper, processed_text)
        
    return processed_text

def process_civic_document(raw_text: str) -> str:
    """
    Orchestrates the 3-step deterministic pipeline and returns a JSON string.
    """
    # Step 1: Summarize
    summary = extract_summary(raw_text)
    
    # Step 2: Readability Score
    readability = score_readability(summary)
    
    # Step 3: Glossary Injection
    html_summary = inject_glossary(summary)
    
    result = {
        "original_length": len(raw_text),
        "summary_html": html_summary,
        "readability_score": readability["score"],
        "requires_manual_review": readability["requires_manual_review"]
    }
    
    return json.dumps(result, indent=2)

if __name__ == "__main__":
    import sys
    
    # Read text from standard input
    input_text = sys.stdin.read()
    
    if input_text.strip():
        output = process_civic_document(input_text)
        print(output)
