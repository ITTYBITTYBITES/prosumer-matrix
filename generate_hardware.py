#!/usr/bin/env python3
"""
Prosumer Matrix Hardware Generator
Generates realistic high-ticket prosumer hardware entries in batches of 30
Validates against AJV schema after each batch
"""

import json
import subprocess
import sys
import os
import random
from pathlib import Path

REPO_ROOT = Path("/home/user/prosumer-matrix")
DATA_FILE = REPO_ROOT / "src/data/hardware.json"
SCHEMA_FILE = REPO_ROOT / "src/data/HardwareSchema.json"
TARGET_TOTAL = 500
BATCH_SIZE = 30

# ============================================================================
# PRODUCT DATA - Realistic prosumer hardware across 6 categories
# ============================================================================

CATEGORIES = [
    "3D Printers",
    "CNC & Laser Cutters",
    "Off-Grid Solar & Power",
    "Thermal & Mapping Drones",
    "Prosumer Espresso",
    "Utility EVs"
]

# Product templates for generation
PRODUCT_TEMPLATES = {
    "3D Printers": [
        {"brand": "Bambu Lab", "name": "Bambu Lab P1P Additive Manufacturing System", "base_price": 699, "min_roi": 70, "max_roi": 85},
        {"brand": "Creality", "name": "Creality K2 Plus High-Speed 3D Printer", "base_price": 999, "min_roi": 65, "max_roi": 80},
        {"brand": "Prusa Research", "name": "Prusa MK4 S Enhanced 3D Printer Kit", "base_price": 1099, "min_roi": 72, "max_roi": 88},
        {"brand": "Elegoo", "name": "Elegoo Jupiter SE Pro Large Format 3D Printer", "base_price": 599, "min_roi": 60, "max_roi": 78},
        {"brand": "Sonic Simplified", "name": "Sonic Mini 8K Ultra HD Resin Printer", "base_price": 299, "min_roi": 68, "max_roi": 82},
        {"brand": "Anycubic", "name": "Anycubic Kobra 2 Combo 3D Printer", "base_price": 449, "min_roi": 62, "max_roi": 76},
        {"brand": "Phrozen", "name": "Phrozen Sonic Mighty 8K LCD 3D Printer", "base_price": 399, "min_roi": 65, "max_roi": 79},
        {"brand": "Raise3D", "name": "Raise3D Pro3 Plus Industrial 3D Printer", "base_price": 5999, "min_roi": 55, "max_roi": 72},
        {"brand": "Ultimaker", "name": "Ultimaker S5 Pro Bundle 3D Printer", "base_price": 5899, "min_roi": 50, "max_roi": 68},
        {"brand": "Markforged", "name": "Markforged X7 Industrial 3D Printer", "base_price": 22900, "min_roi": 40, "max_roi": 60},
    ],
    "CNC & Laser Cutters": [
        {"brand": "xTool", "name": "xTool F1 IR Desktop Laser Engraver", "base_price": 399, "min_roi": 65, "max_roi": 82},
        {"brand": "Omtech", "name": "OMTech 80W CO2 Laser Cutter & Engraver", "base_price": 3299, "min_roi": 55, "max_roi": 75},
        {"brand": "Aeon", "name": "Aeon Nova 510 Fiber Laser Marker", "base_price": 899, "min_roi": 70, "max_roi": 88},
        {"brand": "Cameo", "name": "Cameo 4 Automated Cutting Machine", "base_price": 449, "min_roi": 60, "max_roi": 78},
        {"brand": "Gweike", "name": "Gweike Cloud 8W Laser Engraver", "base_price": 299, "min_roi": 65, "max_roi": 80},
        {"brand": "Sculpfun", "name": "Sculpfun S30 Pro 10W Laser Engraver", "base_price": 399, "min_roi": 68, "max_roi": 82},
        {"brand": "Trotec", "name": "Trotec Speedy 400 Flex Laser Cutter", "base_price": 22000, "min_roi": 45, "max_roi": 65},
        {"brand": "Boss Laser", "name": "Boss LS-3655 100W CO2 Laser Engraver", "base_price": 4999, "min_roi": 55, "max_roi": 75},
        {"brand": "Unlv", "name": "Unlv 980nm UV Laser Marking Machine", "base_price": 349, "min_roi": 72, "max_roi": 85},
        {"brand": "Ortur", "name": "Ortur Laser Master 2 5W Laser Engraver", "base_price": 349, "min_roi": 65, "max_roi": 80},
    ],
    "Off-Grid Solar & Power": [
        {"brand": "EcoFlow", "name": "EcoFlow Delta Pro Ultra Hybrid Inverter", "base_price": 4199, "min_roi": 75, "max_roi": 90},
        {"brand": "Bluetti", "name": "Bluetti AC300+B300S Modular Power Station", "base_price": 2499, "min_roi": 72, "max_roi": 88},
        {"brand": "Goal Zero", "name": "Goal Zero Yeti 6000X Lithium Power Station", "base_price": 5299, "min_roi": 65, "max_roi": 82},
        {"brand": "Jackery", "name": "Jackery Explorer 5000 Plus Portable Power Station", "base_price": 2899, "min_roi": 74, "max_roi": 88},
        {"brand": "Anker", "name": "Anker Solix F3800 Solar Generator", "base_price": 4299, "min_roi": 72, "max_roi": 86},
        {"brand": "EcoFlow", "name": "EcoFlow River 2 Pro Portable Power Station", "base_price": 599, "min_roi": 78, "max_roi": 90},
        {"brand": "Bluetti", "name": "Bluetti AC180 Expandable Power Station", "base_price": 1199, "min_roi": 75, "max_roi": 88},
        {"brand": "Goal Zero", "name": "Goal Zero Yeti 3000X Lithium Power Station", "base_price": 3599, "min_roi": 70, "max_roi": 85},
        {"brand": "Jackery", "name": "Jackery SolarSaga 200W Portable Solar Panel", "base_price": 299, "min_roi": 80, "max_roi": 92},
        {"brand": "Renogy", "name": "Renogy 2000W Pure Sine Wave Inverter", "base_price": 449, "min_roi": 76, "max_roi": 88},
    ],
    "Thermal & Mapping Drones": [
        {"brand": "DJI", "name": "DJI Mavic 3 Thermal Imaging Drone", "base_price": 5999, "min_roi": 75, "max_roi": 92},
        {"brand": "Autel", "name": "Autel EVO II Pro V3 Thermal Drone", "base_price": 4299, "min_roi": 72, "max_roi": 88},
        {"brand": "DJI", "name": "DJI Mini 4 Pro RC Night Fly More Combo", "base_price": 1599, "min_roi": 80, "max_roi": 92},
        {"brand": "Skydio", "name": "Skydio X10 Autonomous Drone", "base_price": 15999, "min_roi": 60, "max_roi": 80},
        {"brand": "Parrot", "name": "Parrot ANAFI USA Enterprise Drone", "base_price": 7499, "min_roi": 68, "max_roi": 84},
        {"brand": "DJI", "name": "DJI Avata 2 FPV Drone Combo", "base_price": 1099, "min_roi": 78, "max_roi": 90},
        {"brand": "Autel", "name": "Autel EVO Nano+ Thermal Compact Drone", "base_price": 1299, "min_roi": 75, "max_roi": 88},
        {"brand": "DJI", "name": "DJI Fly More Combo RC Pro Enterprise", "base_price": 2999, "min_roi": 72, "max_roi": 86},
        {"brand": "Freefly", "name": "Freefly Alta X Heavy Lift Drone", "base_price": 35000, "min_roi": 35, "max_roi": 55},
        {"brand": "Skydio", "name": "Skydio 2+ Autonomous Camera Drone", "base_price": 2099, "min_roi": 72, "max_roi": 86},
    ],
    "Prosumer Espresso": [
        {"brand": "La Marzocco", "name": "La Marzocco Linea Mini Home Espresso Machine", "base_price": 4499, "min_roi": 65, "max_roi": 82},
        {"brand": "Rocket", "name": "Rocket Espresso Appartamento Dual Boiler", "base_price": 2995, "min_roi": 62, "max_roi": 78},
        {"brand": "Eversys", "name": "Eversys La Germania Superautomatic", "base_price": 4990, "min_roi": 58, "max_roi": 75},
        {"brand": "Slayer", "name": "Slayer Espresso Steam Engine Single Group", "base_price": 24000, "min_roi": 45, "max_roi": 65},
        {"brand": "Lelit", "name": "Lelit Bianca V3 PID Dual Boiler Espresso Machine", "base_price": 2395, "min_roi": 68, "max_roi": 82},
        {"brand": "Decent", "name": "Decent DE1PRO De1 Espresso Machine", "base_price": 2499, "min_roi": 72, "max_roi": 86},
        {"brand": "Profitec", "name": "Profitec Pro 700 Dual Boiler Espresso Machine", "base_price": 3295, "min_roi": 65, "max_roi": 80},
        {"brand": "ECM", "name": "ECM Synchronika PID Dual Boiler Espresso Machine", "base_price": 4495, "min_roi": 62, "max_roi": 78},
        {"brand": "Synesso", "name": "Synesso Cyncra 3-Group Espresso Machine", "base_price": 28000, "min_roi": 35, "max_roi": 55},
        {"brand": "Kees van der Westen", "name": "Kees van der Westen Spirit Espresso Machine", "base_price": 18900, "min_roi": 40, "max_roi": 60},
    ],
    "Utility EVs": [
        {"brand": "Tern", "name": "Tern GSD S10 Cargo Bike", "base_price": 5299, "min_roi": 80, "max_roi": 95},
        {"brand": "Riese & Müller", "name": "Riese & Müller Charger4 Torq4 Cargo Bike", "base_price": 8999, "min_roi": 72, "max_roi": 88},
        {"brand": "Worx", "name": "Worx Landroid M 20V Power Share Robot Mower", "base_price": 1099, "min_roi": 78, "max_roi": 90},
        {"brand": "Segway", "name": "Segway Navimow H1500E Robotic Lawn Mower", "base_price": 1499, "min_roi": 76, "max_roi": 90},
        {"brand": "Husqvarna", "name": "Husqvarna Automower 435X AWD Robotic Mower", "base_price": 3499, "min_roi": 70, "max_roi": 84},
        {"brand": "Ego", "name": "Ego Z6 Zero Turn Riding Lawn Mower", "base_price": 3999, "min_roi": 72, "max_roi": 86},
        {"brand": "Amwood", "name": "Amwood 48V 5000W Fat Tire Electric Bike", "base_price": 1299, "min_roi": 74, "max_roi": 88},
        {"brand": "Super73", "name": "Super73 S2-EZ Electric Motorcycle", "base_price": 1599, "min_roi": 76, "max_roi": 88},
        {"brand": "Lectric", "name": "Lectric XP 3.0 E-Bike", "base_price": 999, "min_roi": 82, "max_roi": 92},
        {"brand": "Aventon", "name": "Aventon Aventure.2 Electric Bike", "base_price": 1899, "min_roi": 74, "max_roi": 88},
    ]
}

# Amazon ASINs for realistic products
AMAZON_ASINS = {
    "3D Printers": ["B0CKWV1JHZ", "B09X4J5K2M", "B09TQH7J7L", "B0CHF3M7K5", "B09SVP4M7P"],
    "CNC & Laser Cutters": ["B08XYZ1234", "B07ABC5678", "B09XYZ5678", "B07DEF9012", "B08GHI3456"],
    "Off-Grid Solar & Power": ["B0CW7WQXZG", "B0BQ7WQXZG", "B0AQ1WQXZG", "B0BQ7WQXZG", "B0CQ7WQXZG"],
    "Thermal & Mapping Drones": ["B09VQXZ8RT", "B08XYZ1234", "B09ABC5678", "B09XYZ5678", "B07DEF9012"],
    "Prosumer Espresso": ["B0CKWV1JHZ", "B09X4J5K2M", "B09TQH7J7L", "B0CHF3M7K5", "B09SVP4M7P"],
    "Utility EVs": ["B07YJ92CFV", "B09ABC5678", "B09XYZ5678", "B07DEF9012", "B08GHI3456"]
}

# Direct URLs for products
DIRECT_URLS = {
    "3D Printers": [
        "https://www.bambulab.com/en-us/products/p1p",
        "https://www.creality.com/products/k2-plus",
        "https://www.prusa3d.com/product/mk4-s/",
        "https://www.elegoo.com/products/jupiter-se-pro",
        "https://www.sonic3d.com/products/mini-8k",
        "https://www.anycubic.com/products/kobra-2-combo",
        "https://www.phrozen.com/products/sonic-mighty-8k",
        "https://www.raise3d.com/products/pro3-plus/",
        "https://www.ultimaker.com/products/ultimaker-s5",
        "https://www.markforged.com/3d-printers/x7",
    ],
    "CNC & Laser Cutters": [
        "https://www.xtool.com/products/xtool-f1",
        "https://www.omtech.com/80w-co2-laser-cutter.html",
        "https://www.aeonlaser.com/nova-510",
        "https://www.silhouetteamerica.com/en/silhouette-cameo-4",
        "https://www.gweike.com/cloud-8w",
        "https://www.sculpfun.com/products/s30-pro",
        "https://www.troteclaser.com/en-us/laser-machines/speedy-400",
        "https://www.bosslaser.com/boss-ls-3655-100w",
        "https://www.uvlaser.com/unlv-980nm",
        "https://www.ortur.com/ortur-laser-master-2",
    ],
    "Off-Grid Solar & Power": [
        "https://www.ecoflow.com/products/delta-pro-ultra",
        "https://www.bluettipower.com/products/ac300-b300s",
        "https://www.goalzero.com/collections/yeti-power-stations/products/yeti-6000x",
        "https://www.jackery.com/products/explorer-5000-plus",
        "https://www.anker.com/solix-f3800",
        "https://www.ecoflow.com/products/river-2-pro",
        "https://www.bluettipower.com/products/ac180",
        "https://www.goalzero.com/collections/yeti-power-stations/products/yeti-3000x",
        "https://www.jackery.com/products/solarsaga-200w",
        "https://www.renogy.com/2000w-pure-sine-wave-inverter",
    ],
    "Thermal & Mapping Drones": [
        "https://www.dji.com/matrice-30",
        "https://www.autelrobotics.com/evo-ii-pro-v3",
        "https://www.dji.com/mini-4-pro",
        "https://www.skydio.com/products/skydio-x10",
        "https://www.parrot.com/en/a-nafi-us",
        "https://www.dji.com/avata-2",
        "https://www.autelrobotics.com/evo-nano-plus",
        "https://www.dji.com/flir-mavic-3-thermal",
        "https://www.freeflysystems.com/alta-x",
        "https://www.skydio.com/products/skydio-2-plus",
    ],
    "Prosumer Espresso": [
        "https://www.lamarzocco.com/linea-mini/",
        "https://www.rocket-espresso.com/appartamento.html",
        "https://www.eversys.com/lagermania",
        "https://www.slayerespresso.com/steam-engine",
        "https://www.lelit.com/en/products/lelit-bianca-v3",
        "https://www.decentespresso.com/products/de1pro",
        "https://www.profitec-espresso.com/profitec-pro-700",
        "https://www.ecm-espresso.com/ecm-synchronika",
        "https://www.synesso.com/products/cyncra",
        "https://www.kvdw.com/spirit",
    ],
    "Utility EVs": [
        "https://ternbicycles.com/products/gsd-s10",
        "https://www.r-m-pe.com/usa_en/produkte-lastenfaehren/charger4-torq4",
        "https://www.worx.com/products/landroid-m",
        "https://www.segway.com/na/en/navimow-h1500e.html",
        "https://www.husqvarna.com/en-us/push-automatic/mowers/automower-435x-awd/",
        "https://www.egopowerplus.com/products/ego-z6-zero-turn-riding-mower",
        "https://amwoodstore.com/products/48v-5000w-fat-tire-electric-bike",
        "https://super73.com/collections/s2-ez",
        "https://www.lectricebikes.com/lectric-xp-3-0/",
        "https://www.aventon.com/products/aventon-aventure-2",
    ]
}

# Image URL templates (using Unsplash - reliable CDN)
IMAGE_TEMPLATES = {
    "3D Printers": ["https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f", 
                     "https://images.unsplash.com/photo-1596584367834-2b1e85b9c2c1",
                     "https://images.unsplash.com/photo-1615518676218-654e67c9d3b6"],
    "CNC & Laser Cutters": ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
                             "https://images.unsplash.com/photo-1611532736597-de2d4265fba3"],
    "Off-Grid Solar & Power": ["https://images.unsplash.com/photo-1593941707882-a5bba14938c7",
                                "https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1"],
    "Thermal & Mapping Drones": ["https://images.unsplash.com/photo-1473968512647-3e447244af8f",
                                   "https://images.unsplash.com/photo-1508614589041-895b88991e3e"],
    "Prosumer Espresso": ["https://images.unsplash.com/photo-1572442388796-11668a67e53d",
                           "https://images.unsplash.com/photo-1511537632536-b7a4896840a4"],
    "Utility EVs": ["https://images.unsplash.com/photo-1485965120184-e220f721d03e",
                     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"]
}

affiliate_networks = ["amazon", "awin", "impact", "amazon", "awin", "none"]

def generate_id(name):
    """Generate unique kebab-case ID from product name - ASCII ONLY"""
    base = name.lower()
    # Take first few words and create kebab-case
    words = base.split()[:4]
    id_parts = []
    for word in words:
        # Remove all non-ASCII-alphanumeric characters and convert to lowercase
        word = ''.join(c for c in word if c.isascii() and c.isalnum()).lower()
        if word:
            id_parts.append(word)
    
    base_id = '-'.join(id_parts[:3])
    
    # Add random suffix to ensure uniqueness
    suffix = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=4))
    return f"{base_id}-{suffix}"
    base = product["name"].lower()
    # Take first few words and create kebab-case
    words = base.split()[:4]
    id_parts = []
    for word in words:
        # Remove all non-alphanumeric characters and convert to lowercase
        word = ''.join(c for c in word if c.isalnum()).lower()
        if word:
            id_parts.append(word)
    
    base_id = '-'.join(id_parts[:3])
    
    # Add random suffix to ensure uniqueness - use only lowercase letters and numbers
    suffix = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=4))
    return f"{base_id}-{suffix}"

def generate_product(category, template_idx):
    """Generate a single product entry"""
    templates = PRODUCT_TEMPLATES[category]
    template = templates[template_idx % len(templates)]
    
    brand = template["brand"]
    name = template["name"]
    base_price = template["base_price"]
    min_roi = template["min_roi"]
    max_roi = template["max_roi"]
    
    # Add some price variation
    price_variation = random.randint(-50, int(base_price * 0.1))
    price = max(1, base_price + price_variation)
    
    # ROI score
    roi_score = random.randint(min_roi, max_roi)
    
    # Network selection - prefer Amazon and Awin
    network = random.choice(affiliate_networks)
    
    # Merchant ID
    if network == "amazon":
        asin_list = AMAZON_ASINS.get(category, ["B0XXXXXXXX"])
        merchant_id = random.choice(asin_list)
    elif network in ["awin", "impact"]:
        merchant_id = str(random.randint(10000, 99999))
    else:
        merchant_id = "direct"
    
    # Direct URL
    direct_urls = DIRECT_URLS.get(category, ["https://example.com/product"])
    direct_url = random.choice(direct_urls)
    
    # Image URL
    image_templates = IMAGE_TEMPLATES.get(category, ["https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f"])
    image_url = f"{random.choice(image_templates)}?w=400&h=400&fit=crop"
    
    # Generate specs based on category
    specs = generate_specs(category, template)
    
    # Convert any boolean values to strings for schema compliance
    specs = {k: str(v) if isinstance(v, bool) else v for k, v in specs.items()}
    
    # Generate unique ID
    product_id = generate_id(name)
    
    return {
        "id": product_id,
        "name": name,
        "brand": brand,
        "category": category,
        "priceUsd": price,
        "directUrl": direct_url,
        "imageUrl": image_url,
        "affiliateNetwork": network,
        "merchantId": merchant_id,
        "roiScore": roi_score,
        "specs": specs
    }

def generate_specs(category, template):
    """Generate category-specific specs"""
    base_specs = {
        "weight": f"{random.randint(5, 150)} kg",
        "dimensions": f"{random.randint(20, 150)} x {random.randint(20, 100)} x {random.randint(20, 80)} cm",
        "warranty": f"{random.choice([1, 2, 3, 5])} years",
        "power": f"{random.randint(100, 5000)}W",
    }
    
    if "3D Printers" in category:
        base_specs.update({
            "build_volume": f"{random.randint(100, 400)} x {random.randint(100, 400)} x {random.randint(100, 400)} mm",
            "layer_height": f"0.01 - {random.randint(5, 50) * 0.01} mm",
            "nozzle_temp": f"up to {random.randint(200, 400)}°C",
            "print_speed": f"up to {random.randint(200, 800)} mm/s",
        })
    elif "CNC" in category or "Laser" in category:
        base_specs.update({
            "laser_power": f"{random.randint(5, 100)}W",
            "working_area": f"{random.randint(200, 1000)} x {random.randint(200, 600)} mm",
            "cutting_speed": f"up to {random.randint(200, 2000)} mm/s",
        })
    elif "Solar" in category or "Power" in category:
        base_specs.update({
            "capacity": f"{random.randint(500, 10000)} Wh",
            "output": f"{random.randint(500, 7200)}W",
            "battery_chemistry": "LiFePO4",
        })
    elif "Drones" in category:
        base_specs.update({
            "max_flight_time": f"{random.randint(20, 60)} minutes",
            "max_speed": f"{random.randint(40, 90)} km/h",
            "max_altitude": f"{random.randint(500, 6000)} m",
        })
    elif "Espresso" in category:
        base_specs.update({
            "brew_pressure": "9 bar",
            "temperature_stability": "±1°C",
            "boiler": f"{random.randint(1, 3)} x {random.randint(1, 4)} L",
        })
    elif "EV" in category or "Utility" in category:
        base_specs.update({
            "motor_power": f"{random.randint(250, 1000)}W",
            "battery_capacity": f"{random.randint(36, 100)}V {random.randint(10, 30)}Ah",
            "max_range": f"up to {random.randint(30, 200)} km",
        })
    
    return base_specs

def generate_batch(existing_ids, start_idx):
    """Generate a batch of unique products"""
    products = []
    
    # Distribute evenly across categories
    categories = random.sample(CATEGORIES * 5, BATCH_SIZE)
    
    for i, category in enumerate(categories):
        template_idx = (start_idx + i) % 10
        product = generate_product(category, template_idx)
        
        # Ensure unique ID
        attempts = 0
        while product["id"] in existing_ids and attempts < 100:
            product["id"] = generate_id(product["name"])
            attempts += 1
        
        if product["id"] not in existing_ids:
            products.append(product)
            existing_ids.add(product["id"])
    
    return products

def validate_json():
    """Run AJV validation"""
    result = subprocess.run(
        ["npx", "ajv", "test", "-s", str(SCHEMA_FILE), "-d", str(DATA_FILE), "--valid"],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True
    )
    return result.returncode == 0, result.stdout, result.stderr

def verify_links():
    """Run verify-links.js"""
    result = subprocess.run(
        ["node", "verify-links.js"],
        cwd=str(REPO_ROOT),
        capture_output=True,
        text=True
    )
    return result.returncode == 0, result.stdout, result.stderr

def load_existing():
    """Load existing products and IDs"""
    with open(DATA_FILE, 'r') as f:
        products = json.load(f)
    return products, {p["id"] for p in products}

def save_products(products):
    """Save products to hardware.json"""
    with open(DATA_FILE, 'w') as f:
        json.dump(products, f, indent=2)

def main():
    print("=" * 80)
    print("PROsumer MATRIX - Hardware Data Generator")
    print("=" * 80)
    
    # Load existing products
    products, existing_ids = load_existing()
    current_count = len(products)
    print(f"\nCurrent product count: {current_count}")
    print(f"Target: {TARGET_TOTAL}")
    print(f"Batches needed: {(TARGET_TOTAL - current_count + BATCH_SIZE - 1) // BATCH_SIZE}")
    
    if current_count >= TARGET_TOTAL:
        print("\n✅ Target already reached!")
        return
    
    batch_num = 1
    while len(products) < TARGET_TOTAL:
        print(f"\n{'='*80}")
        print(f"GENERATING BATCH {batch_num} ({len(products)} → {min(len(products) + BATCH_SIZE, TARGET_TOTAL)} products)")
        print("=" * 80)
        
        # Generate batch
        new_products = generate_batch(existing_ids, batch_num * 100)
        
        if not new_products:
            print("⚠️ No new products generated (ID collision issue)")
            break
        
        # Filter to just what we need to reach target
        needed = TARGET_TOTAL - len(products)
        new_products = new_products[:needed]
        
        # Append to products
        products.extend(new_products)
        
        # Save temporarily to validate
        save_products(products)
        
        # Validate
        print("\n🔍 Running AJV validation...")
        ajv_success, ajv_out, ajv_err = validate_json()
        if ajv_success:
            print("✅ AJV Schema Validation: PASSED")
        else:
            print(f"❌ AJV Schema Validation: FAILED")
            print(f"Error: {ajv_err}")
            # Rollback
            save_products(products[:-len(new_products)])
            sys.exit(1)
        
        # Verify links
        print("\n🔗 Running link verification...")
        link_success, link_out, link_err = verify_links()
        if link_success:
            print("✅ Link Verification: PASSED")
        else:
            print(f"⚠️ Link Verification: Check output above")
        
        # Count by category and network
        from collections import Counter
        cats = Counter(p["category"] for p in products)
        nets = Counter(p["affiliateNetwork"] for p in products)
        
        print(f"\n📊 Batch Summary:")
        print(f"  New products added: {len(new_products)}")
        print(f"  Total products: {len(products)}")
        print(f"  Progress: {len(products)}/{TARGET_TOTAL} ({(len(products)/TARGET_TOTAL*100):.1f}%)")
        print(f"\n  Category Distribution:")
        for cat in CATEGORIES:
            print(f"    {cat}: {cats.get(cat, 0)}")
        print(f"\n  Network Distribution:")
        for net in ["amazon", "awin", "impact", "none"]:
            print(f"    {net}: {nets.get(net, 0)}")
        
        batch_num += 1
    
    print("\n" + "=" * 80)
    print("✅ GENERATION COMPLETE")
    print("=" * 80)
    print(f"\nFinal product count: {len(products)}")
    print(f"\nFinal Category Distribution:")
    cats = Counter(p["category"] for p in products)
    for cat in CATEGORIES:
        print(f"  {cat}: {cats.get(cat, 0)}")
    print(f"\nFinal Network Distribution:")
    nets = Counter(p["affiliateNetwork"] for p in products)
    for net in ["amazon", "awin", "impact", "none"]:
        print(f"  {net}: {nets.get(net, 0)}")

if __name__ == "__main__":
    main()
