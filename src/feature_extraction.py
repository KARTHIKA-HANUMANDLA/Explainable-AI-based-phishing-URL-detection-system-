from urllib.parse import urlparse
import re


def extract_url_features(url):
    parsed = urlparse(url)

    # Make sure the URL has a scheme
    if not parsed.scheme:
        url = "http://" + url
        parsed = urlparse(url)

    domain = parsed.netloc
    path = parsed.path
    query = parsed.query

    # Remove port number from domain
    domain_without_port = domain.split(":")[0]

    # URL features
    url_length = len(url)
    domain_length = len(domain_without_port)

    is_domain_ip = int(
        bool(re.fullmatch(r"\d{1,3}(\.\d{1,3}){3}", domain_without_port))
    )

    # TLD
    parts = domain_without_port.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    tld_length = len(tld)

    # Subdomains
    no_of_subdomain = max(len(parts) - 2, 0)

    # Obfuscation
    special_chars = re.findall(r"[^a-zA-Z0-9]", url)
    no_of_obfuscated_char = len(
        re.findall(r"%[0-9a-fA-F]{2}", url)
    )

    has_obfuscation = int(no_of_obfuscated_char > 0)

    obfuscation_ratio = (
        no_of_obfuscated_char / url_length
        if url_length > 0 else 0
    )

    # Character counts
    no_of_letters = len(re.findall(r"[a-zA-Z]", url))
    no_of_digits = len(re.findall(r"\d", url))

    letter_ratio = (
        no_of_letters / url_length
        if url_length > 0 else 0
    )

    digit_ratio = (
        no_of_digits / url_length
        if url_length > 0 else 0
    )

    # Special URL characters
    no_of_equals = url.count("=")
    no_of_qmark = url.count("?")
    no_of_ampersand = url.count("&")

    no_of_other_special_chars = len(
        re.findall(r"[^a-zA-Z0-9:/?&=._-]", url)
    )

    special_char_ratio = (
        no_of_other_special_chars / url_length
        if url_length > 0 else 0
    )

    # HTTPS
    is_https = int(parsed.scheme.lower() == "https")

    return {
        "URLLength": url_length,
        "DomainLength": domain_length,
        "IsDomainIP": is_domain_ip,
        "TLDLength": tld_length,
        "NoOfSubDomain": no_of_subdomain,
        "HasObfuscation": has_obfuscation,
        "NoOfObfuscatedChar": no_of_obfuscated_char,
        "ObfuscationRatio": obfuscation_ratio,
        "NoOfLettersInURL": no_of_letters,
        "LetterRatioInURL": letter_ratio,
        "NoOfDegitsInURL": no_of_digits,
        "DegitRatioInURL": digit_ratio,
        "NoOfEqualsInURL": no_of_equals,
        "NoOfQMarkInURL": no_of_qmark,
        "NoOfAmpersandInURL": no_of_ampersand,
        "NoOfOtherSpecialCharsInURL": no_of_other_special_chars,
        "SpacialCharRatioInURL": special_char_ratio,
        "IsHTTPS": is_https,
    }
def prepare_features_for_model(url):
    features = extract_url_features(url)

    return [
        features["URLLength"],
        features["DomainLength"],
        features["IsDomainIP"],
        features["TLDLength"],
        features["NoOfSubDomain"],
        features["HasObfuscation"],
        features["NoOfObfuscatedChar"],
        features["ObfuscationRatio"],
        features["NoOfLettersInURL"],
        features["LetterRatioInURL"],
        features["NoOfDegitsInURL"],
        features["DegitRatioInURL"],
        features["NoOfEqualsInURL"],
        features["NoOfQMarkInURL"],
        features["NoOfAmpersandInURL"],
        features["NoOfOtherSpecialCharsInURL"],
        features["SpacialCharRatioInURL"],
        features["IsHTTPS"]
    ]
def predict_url(url, model):
    import numpy as np

    features = prepare_features_for_model(url)

    features_array = np.array(features).reshape(1, -1)

    prediction = model.predict(features_array)[0]
    probabilities = model.predict_proba(features_array)[0]

    return {
        "prediction": int(prediction),
        "phishing_probability": float(probabilities[0]),
        "legitimate_probability": float(probabilities[1])
    }