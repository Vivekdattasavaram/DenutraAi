import os
import shutil
import re

source_dir = r"c:\Users\vivek\oral_health_app\fastapi_backend"
target_dir = r"c:\Users\vivek\oral_health_app\fastapi_backend_single"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

def get_all_files(dir_path):
    all_files = []
    for root, dirs, files in os.walk(dir_path):
        if "venv" in root or "__pycache__" in root or ".pytest_cache" in root or ".git" in root:
            continue
        for file in files:
            all_files.append(os.path.join(root, file))
    return all_files

files = get_all_files(source_dir)

# Copy all files to flat directory
for f in files:
    filename = os.path.basename(f)
    if filename == "__init__.py":
        continue
    target_path = os.path.join(target_dir, filename)
    shutil.copy2(f, target_path)

# Now iterate over all .py files in target and replace imports
for filename in os.listdir(target_dir):
    if filename.endswith(".py"):
        filepath = os.path.join(target_dir, filename)
        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read()
        
        # Regex replacements for imports
        content = re.sub(r'from\s+app\s+import\s+', r'from . import ', content)
        content = re.sub(r'from\s+app\.models\s+import\s+', r'from models import ', content)
        content = re.sub(r'from\s+app\.schemas\s+import\s+', r'from schemas import ', content)
        content = re.sub(r'from\s+app\.database\s+import\s+', r'from database import ', content)
        content = re.sub(r'from\s+app\.utils\s+import\s+', r'from utils import ', content)
        content = re.sub(r'from\s+app\.dependencies\s+import\s+', r'from dependencies import ', content)
        content = re.sub(r'from\s+app\.(engines|routes|services|ml)\.([a-zA-Z0-9_]+)\s+import\s+', r'from \2 import ', content)
        content = re.sub(r'from\s+app\.(engines|routes|services|ml)\s+import\s+', r'import ', content)
        content = re.sub(r'from\s+\.(engines|routes|services|ml)\s+import\s+', r'import ', content)
        content = re.sub(r'from\s+\.(engines|routes|services|ml)\.([a-zA-Z0-9_]+)\s+import\s+', r'from \2 import ', content)
        content = re.sub(r'from\s+\.\.(engines|routes|services|ml)\.([a-zA-Z0-9_]+)\s+import\s+', r'from \2 import ', content)
        
        # Relative imports
        content = re.sub(r'from\s+\.\.\s+import\s+models', r'import models', content)
        content = re.sub(r'from\s+\.\.\s+import\s+schemas', r'import schemas', content)
        content = re.sub(r'from\s+\.\.\s+import\s+database', r'import database', content)
        content = re.sub(r'from\s+\.\.\s+import\s+utils', r'import utils', content)
        content = re.sub(r'from\s+\.\.\s+import\s+dependencies', r'import dependencies', content)
        
        content = re.sub(r'from\s+\.\.models\s+import\s+', r'from models import ', content)
        content = re.sub(r'from\s+\.\.schemas\s+import\s+', r'from schemas import ', content)
        content = re.sub(r'from\s+\.\.database\s+import\s+', r'from database import ', content)
        content = re.sub(r'from\s+\.\.utils\s+import\s+', r'from utils import ', content)
        content = re.sub(r'from\s+\.\.dependencies\s+import\s+', r'from dependencies import ', content)

        content = re.sub(r'from\s+\.\s+import\s+models', r'import models', content)
        content = re.sub(r'from\s+\.\s+import\s+schemas', r'import schemas', content)
        content = re.sub(r'from\s+\.\s+import\s+database', r'import database', content)
        content = re.sub(r'from\s+\.\s+import\s+utils', r'import utils', content)
        content = re.sub(r'from\s+\.\s+import\s+dependencies', r'import dependencies', content)
        
        content = re.sub(r'from\s+\.models\s+import\s+', r'from models import ', content)
        content = re.sub(r'from\s+\.schemas\s+import\s+', r'from schemas import ', content)
        content = re.sub(r'from\s+\.database\s+import\s+', r'from database import ', content)
        content = re.sub(r'from\s+\.utils\s+import\s+', r'from utils import ', content)
        content = re.sub(r'from\s+\.dependencies\s+import\s+', r'from dependencies import ', content)

        content = re.sub(r'from\s+\.([a-zA-Z0-9_]+)\s+import\s+', r'from \1 import ', content)
        content = re.sub(r'from\s+\.\.([a-zA-Z0-9_]+)\s+import\s+', r'from \1 import ', content)
        
        # ML engine paths fix
        content = re.sub(r"'..',\s*'ml',\s*'oral_health_model.pkl'", r"'oral_health_model.pkl'", content)
        content = re.sub(r"'..',\s*'ml',\s*'risk_model.pkl'", r"'risk_model.pkl'", content)
        
        # Other specific cases
        content = re.sub(r'from\s+\.\.\s+import\s+models,\s*schemas', r'import models, schemas', content)
        content = re.sub(r'from\s+\.\s+import\s+models,\s*schemas', r'import models, schemas', content)
        content = re.sub(r'from\s+app\s+import\s+models,\s*schemas', r'import models, schemas', content)
        
        with open(filepath, "w", encoding="utf-8") as file:
            file.write(content)

print("Flattening complete.")
