# 50-projects

# Golden rule for google

# Step 1: Google Search Developer-Style
Tumhari search ek formula follow kare:

- Component/Concept + Action + Context
  - Example: `"localStorage setItem example JavaScript"`
  - Example: `"fetch API POST request JSON example"`
  - Example: `"Tailwind navbar responsive example"`

Trick: hamesha keywords short aur precise rakho. Filler words jaise "how do I" avoid karo.



# Step 2: Source Filtering
Sab results equal nahi hote. Tumhe filter karna hoga:

-MDN Docs → JavaScript/Browser APIs ke liye best.
-Official Docs → Tailwind, GSAP, React, etc.
-Stack Overflow → Specific error fixes.
-Codepen/Github Gists** → Ready examples.

Ritual: Pehle official docs → phir Stack Overflow → phir blog posts.

# Step 3: Copy → Minimal Example → Implement
Kabhi bhi pura code copy mat karo. Ritual banao:

1.Minimal Example** banao (sirf 2–3 lines jo concept test kare).
js
   // LocalStorage minimal test
   localStorage.setItem("name", "Saad");
   console.log(localStorage.getItem("name"));

2. Dekho output aa raha hai ya nahi.
3. Phir apne project mein integrate karo.

 Isse tumhe **concept samajh aata hai** aur tum apne vault mein ek reusable drill save kar sakte ho.



Example: API Implement Karna
Suppose tumhe API call karni hai:

Google Search Query:

fetch API GET request example site:developer.mozilla.org


Minimal Example:
js
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then(response => response.json())
  .then(data => console.log(data));


Phir tum apne project mein step-by-step integrate karte ho (error handling, UI update, etc.).


# Step 4: Documentation Ritual
Har fix ko ek **micro drill** banao:
- Query jo tumne Google kiya
- Minimal example jo test kiya
- Final implementation jo project mein gaya



#1
To-Do List with Vanilla JS|localStorage 
design and use stuff in there own folder