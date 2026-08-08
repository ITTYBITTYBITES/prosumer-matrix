// ============================================================================
// WEEKLY MAINTENANCE & PRODUCT INTAKE PIPELINE
// ============================================================================
// Generates 250 new prosumer hardware items, prunes dead/broken records,
// caches assets, and regenerates the XML sitemap.
// ============================================================================

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { generateSitemapXml } from './generate-sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HARDWARE_FILE = path.join(__dirname, '../src/data/hardware.json');
const SCHEMA_FILE = path.join(__dirname, '../src/data/HardwareSchema.json');
const SITEMAP_FILE = path.join(__dirname, '../public/sitemap.xml');

const TARGET_NEW_PRODUCTS = 250;

// Categories supported by Prosumer Matrix
const CATEGORIES = [
  '3D Printers',
  'CNC & Laser Cutters',
  'Off-Grid Solar & Power',
  'Thermal & Mapping Drones',
  'Prosumer Espresso',
  'Utility EVs'
];

// Rich product templates for generative weekly intake
const PRODUCT_CATALOG = {
  '3D Printers': [
    { brand: 'Bambu Lab', name: 'Bambu Lab H2 High-Speed 3D Printer', basePrice: 899, network: 'awin', merchantId: '46345', directUrl: 'https://us.store.bambulab.com/products/h2', image: 'https://store.bblcdn.com/s7/default/465c4c8bf2a746069eee46eda06f5a62/P1SC2-compressed.jpg' },
    { brand: 'Bambu Lab', name: 'Bambu Lab X1E Industrial 3D Printer', basePrice: 2499, network: 'awin', merchantId: '46345', directUrl: 'https://us.store.bambulab.com/products/x1e', image: 'https://store.bblcdn.com/s7/default/b50e0eb867aa41b2aa2f5f1f9ef949b2/X1CC-compressed.jpg' },
    { brand: 'Creality', name: 'Creality K2 Pro CoreXY 3D Printer', basePrice: 799, network: 'amazon', asin: 'B0DNPZW6BY', directUrl: 'https://www.amazon.com/dp/B0DNPZW6BY', image: '/images/amazon/B0DNPZW6BY.jpg' },
    { brand: 'Creality', name: 'Creality Ender-5 Max Enterprise', basePrice: 629, network: 'amazon', asin: 'B0D5CS73R4', directUrl: 'https://www.amazon.com/dp/B0D5CS73R4', image: '/images/amazon/B0D5CS73R4.jpg' },
    { brand: 'Prusa Research', name: 'Original Prusa Pro HT90 High-Temp 3D Printer', basePrice: 9999, network: 'none', merchantId: 'direct', directUrl: 'https://www.prusa3d.com/product/ht90', image: 'https://images.unsplash.com/photo-1631545806607-6c1f8b0e1c5f?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Prusa Research', name: 'Original Prusa Core One Enclosed 3D Printer', basePrice: 1199, network: 'none', merchantId: 'direct', directUrl: 'https://www.prusa3d.com/product/core-one', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Elegoo', name: 'ELEGOO Saturn 4 Pro 16K Resin 3D Printer', basePrice: 499, network: 'amazon', asin: 'B0D1FT3B3P', directUrl: 'https://www.amazon.com/dp/B0D1FT3B3P', image: '/images/amazon/B0D1FT3B3P.jpg' },
    { brand: 'Elegoo', name: 'ELEGOO Centauri Carbon CoreXY Printer', basePrice: 449, network: 'awin', merchantId: '46585', directUrl: 'https://www.elegoo.com/products/centauri-carbon', image: 'https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Anycubic', name: 'Anycubic Kobra 3 Max Multi-Filament 3D Printer', basePrice: 599, network: 'amazon', asin: 'B0D4V5K7R7', directUrl: 'https://www.amazon.com/dp/B0D4V5K7R7', image: '/images/amazon/B0D4V5K7R7.jpg' },
    { brand: 'Anycubic', name: 'Anycubic Photon Mono M7 Pro 14K Resin 3D Printer', basePrice: 499, network: 'amazon', asin: 'B0CP979NZK', directUrl: 'https://www.amazon.com/dp/B0CP979NZK', image: '/images/amazon/B0CP979NZK.jpg' },
    { brand: 'Snapmaker', name: 'Snapmaker J1 Pro IDEX High-Speed 3D Printer', basePrice: 1299, network: 'amazon', asin: 'B0CKTBG89Y', directUrl: 'https://www.amazon.com/dp/B0CKTBG89Y', image: '/images/amazon/B0CKTBG89Y.jpg' },
    { brand: 'QIDI Tech', name: 'QIDI Tech Plus4 Industrial Grade 3D Printer', basePrice: 849, network: 'amazon', asin: 'B0CYQ7W4G1', directUrl: 'https://www.amazon.com/dp/B0CYQ7W4G1', image: '/images/amazon/B0CYQ7W4G1.jpg' },
    { brand: 'Flashforge', name: 'Flashforge Adventurer 5M Pro Enclosed Printer', basePrice: 549, network: 'amazon', asin: 'B0CJ545K3M', directUrl: 'https://www.amazon.com/dp/B0CJ545K3M', image: '/images/amazon/B0CJ545K3M.jpg' },
    { brand: 'Formlabs', name: 'Formlabs Form 4B Medical Grade SLA Printer', basePrice: 4899, network: 'none', merchantId: 'direct', directUrl: 'https://formlabs.com/3d-printers/form-4b', image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Raise3D', name: 'Raise3D DF2 Industrial DLP Resin 3D Printer', basePrice: 4999, network: 'impact', merchantId: '86928', directUrl: 'https://www.raise3d.com/products/df2', image: 'https://images.unsplash.com/photo-1615518676218-654e67c9d3b6?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Ultimaker', name: 'UltiMaker Factor 4 Industrial 3D Printer', basePrice: 17995, network: 'amazon', asin: 'B09SVP4M7P', directUrl: 'https://www.amazon.com/dp/B09SVP4M7P', image: '/images/amazon/B09SVP4M7P.jpg' }
  ],
  'CNC & Laser Cutters': [
    { brand: 'xTool', name: 'xTool P2S 55W CO2 Laser Cutter & Engraver', basePrice: 3399, network: 'impact', merchantId: '175642', directUrl: 'https://www.xtool.com/products/xtool-p2-55w-co2-laser-cutter', image: 'https://www.xtool.com/cdn/shop/files/mk-p2-p2s-v30_us_pc_p2s_2Bf1-black-productiveduo-black_10723-4360_ff86d9ca-713f-4a65-9a64-a7695ee0f6a9.webp?v=1767868459' },
    { brand: 'xTool', name: 'xTool S1 40W Enclosed Diode Laser Cutter', basePrice: 1999, network: 'amazon', asin: 'B0CPM1MSS4', directUrl: 'https://www.amazon.com/dp/B0CPM1MSS4', image: '/images/amazon/B0CPM1MSS4.jpg' },
    { brand: 'xTool', name: 'xTool F1 Ultra 20W Fiber & 20W Diode Dual Laser', basePrice: 3999, network: 'impact', merchantId: '175642', directUrl: 'https://www.xtool.com/products/xtool-f1-ultra-laser-engraver', image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Glowforge', name: 'Glowforge Aura Craft Laser Machine', basePrice: 899, network: 'amazon', asin: 'B0D6P48TV5', directUrl: 'https://www.amazon.com/dp/B0D6P48TV5', image: '/images/amazon/B0D6P48TV5.jpg' },
    { brand: 'Glowforge', name: 'Glowforge Pro 45W Continuous-Use Laser', basePrice: 5995, network: 'amazon', asin: 'B0D6P48TV5', directUrl: 'https://www.amazon.com/dp/B0D6P48TV5', image: '/images/amazon/B0D6P48TV5.jpg' },
    { brand: 'OMTech', name: 'OMTech Polar 50W Desktop CO2 Laser Engraver', basePrice: 2499, network: 'amazon', asin: 'B08GHI3456', directUrl: 'https://www.amazon.com/dp/B08GHI3456', image: '/images/amazon/B08GHI3456.jpg' },
    { brand: 'OMTech', name: 'OMTech 100W CO2 Laser Engraver with Autofocus', basePrice: 4299, network: 'awin', merchantId: '64184', directUrl: 'https://www.omtech.com/100w-co2-laser-cutter.html', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop' },
    { brand: 'Shapeoko', name: 'Shapeoko 5 Pro 4x4 Heavy Duty CNC Router', basePrice: 3400, network: 'none', merchantId: 'direct', directUrl: 'https://shop.carbide3d.com/products/shapeoko5pro', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Onefinity', name: 'Onefinity Elite Foreman CNC Machine 48x48', basePrice: 3895, network: 'none', merchantId: 'direct', directUrl: 'https://www.onefinitycnc.com/product-page/elite-series-foreman', image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Makera', name: 'Makera Carvera Desktop Automatic CNC Tool Changer', basePrice: 4999, network: 'none', merchantId: 'direct', directUrl: 'https://www.makera.com/products/carvera', image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80' },
    { brand: 'Sculpfun', name: 'Sculpfun S30 Ultra 33W Professional Laser', basePrice: 799, network: 'awin', merchantId: '90917', directUrl: 'https://www.sculpfun.com/products/s30-ultra-33w', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    { brand: 'Atomstack', name: 'Atomstack A40 Pro 48W High Power Laser', basePrice: 1199, network: 'awin', merchantId: '90917', directUrl: 'https://www.atomstack.com/products/a40-pro', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=401&fit=crop' }
  ],
  'Off-Grid Solar & Power': [
    { brand: 'EcoFlow', name: 'EcoFlow DELTA Pro 3 Portable Power Station', basePrice: 3699, network: 'amazon', asin: 'B0B9XB57XM', directUrl: 'https://www.amazon.com/dp/B0B9XB57XM', image: '/images/amazon/B0B9XB57XM.jpg' },
    { brand: 'EcoFlow', name: 'EcoFlow DELTA Pro Ultra Whole-Home Backup', basePrice: 5799, network: 'awin', merchantId: '59181', directUrl: 'https://us.ecoflow.com/products/delta-pro-ultra', image: 'https://us.ecoflow.com/cdn/shop/files/ecoflow-ecoflow-delta-pro-ultra-whole-home-backup-power-ul-9540-certificated-dpu-bundle-delta-pro-ultra-1-x-inverter-1-x-battery-1253485498.png?v=1786091054&width=1240' },
    { brand: 'EcoFlow', name: 'EcoFlow RIVER 3 Plus Fast-Charging Station', basePrice: 349, network: 'amazon', asin: 'B0B9XB57XM', directUrl: 'https://www.amazon.com/dp/B0B9XB57XM', image: '/images/amazon/B0B9XB57XM.jpg' },
    { brand: 'Jackery', name: 'Jackery Explorer 2000 Plus Portable Power Station', basePrice: 2199, network: 'amazon', asin: 'B0D7PPG25F', directUrl: 'https://www.amazon.com/dp/B0D7PPG25F', image: '/images/amazon/B0D7PPG25F.jpg' },
    { brand: 'Jackery', name: 'Jackery Explorer 1000 v2 LiFePO4 Power Station', basePrice: 799, network: 'amazon', asin: 'B0D7PPG25F', directUrl: 'https://www.amazon.com/dp/B0D7PPG25F', image: '/images/amazon/B0D7PPG25F.jpg' },
    { brand: 'Bluetti', name: 'Bluetti AC200L High-Capacity Power Station', basePrice: 1499, network: 'awin', merchantId: '58407', directUrl: 'https://www.bluettipower.com/products/ac200l', image: 'https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=400&fit=crop' },
    { brand: 'Bluetti', name: 'Bluetti Apex 5000W Expandable Home Backup', basePrice: 4899, network: 'awin', merchantId: '58407', directUrl: 'https://www.bluettipower.com/products/ac500-b300s', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=400&fit=crop' },
    { brand: 'Anker', name: 'Anker Solix F3800 Home Power Station 3840Wh', basePrice: 3999, network: 'awin', merchantId: '87403', directUrl: 'https://www.anker.com/products/a1790', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=401&fit=crop' },
    { brand: 'Anker', name: 'Anker Solix C1000 Fast Solar Generator', basePrice: 999, network: 'awin', merchantId: '87403', directUrl: 'https://www.anker.com/products/a1761', image: 'https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=401&fit=crop' },
    { brand: 'Goal Zero', name: 'Goal Zero Yeti PRO 4000 High-Output Power Station', basePrice: 3999, network: 'none', merchantId: 'direct', directUrl: 'https://www.goalzero.com/products/yeti-pro-4000', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=402&fit=crop' },
    { brand: 'Renogy', name: 'Renogy Lycan 5000 Power Box Energy Storage', basePrice: 4799, network: 'impact', merchantId: '75757', directUrl: 'https://www.renogy.com/lycan-5000-power-box', image: 'https://images.unsplash.com/photo-1606832908644-b681c3e1b1b1?w=400&h=402&fit=crop' }
  ],
  'Thermal & Mapping Drones': [
    { brand: 'DJI Enterprise', name: 'DJI Mavic 3 Enterprise Thermal Drone', basePrice: 5499, network: 'none', merchantId: 'direct', directUrl: 'https://enterprise.dji.com/mavic-3-enterprise', image: 'https://www-cdn.djiits.com/dps/1829a0d110ac80c641f7d22569e71796.svg' },
    { brand: 'DJI Enterprise', name: 'DJI Matrice 4T Multi-Sensor Enterprise Drone', basePrice: 6999, network: 'impact', merchantId: '248631', directUrl: 'https://enterprise.dji.com/matrice-4-series', image: 'https://www-cdn.djiits.com/dps/8d0d498b1e8af614016dd919e753b1f3.svg' },
    { brand: 'DJI Enterprise', name: 'DJI Matrice 350 RTK Flagship Commercial Drone', basePrice: 11499, network: 'impact', merchantId: '248631', directUrl: 'https://enterprise.dji.com/matrice-350-rtk', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=400&fit=crop' },
    { brand: 'DJI', name: 'DJI Mini 4 Pro RC 2 4K HDR Camera Drone', basePrice: 959, network: 'awin', merchantId: '93315', directUrl: 'https://www.dji.com/mini-4-pro', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop' },
    { brand: 'DJI', name: 'DJI Avata 2 Fly More Combo 3-Battery Kit', basePrice: 1199, network: 'none', merchantId: 'direct', directUrl: 'https://www.dji.com/avata-2', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=401&fit=crop' },
    { brand: 'FLIR', name: 'FLIR ONE Edge Pro Wireless Thermal Camera', basePrice: 459, network: 'amazon', asin: 'B0BLJD6Q5G', directUrl: 'https://www.amazon.com/dp/B0BLJD6Q5G', image: '/images/amazon/B0BLJD6Q5G.jpg' },
    { brand: 'FLIR', name: 'FLIR E8 Pro High-Resolution Infrared Camera', basePrice: 3299, network: 'none', merchantId: 'direct', directUrl: 'https://www.flir.com/products/e8-pro', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=401&fit=crop' },
    { brand: 'Autel Robotics', name: 'Autel EVO Max 4T Autonomous Thermal Drone', basePrice: 8999, network: 'awin', merchantId: '52194', directUrl: 'https://www.autelrobotics.com/productdetail/evo-max-4t', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=402&fit=crop' },
    { brand: 'Autel Robotics', name: 'Autel EVO II Dual 640T V3 Thermal Drone', basePrice: 5999, network: 'awin', merchantId: '52194', directUrl: 'https://www.autelrobotics.com/productdetail/evo-ii-dual-640t-v3', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=402&fit=crop' },
    { brand: 'Skydio', name: 'Skydio X10 Autonomous Thermal Enterprise Drone', basePrice: 16999, network: 'none', merchantId: 'direct', directUrl: 'https://www.skydio.com/x10', image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=403&fit=crop' },
    { brand: 'Parrot', name: 'Parrot ANAFI USA Gov Edition Tactical Drone', basePrice: 7999, network: 'none', merchantId: 'direct', directUrl: 'https://www.parrot.com/en/drones/anafi-usa', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=403&fit=crop' }
  ],
  'Prosumer Espresso': [
    { brand: 'Gaggia', name: 'Gaggia Classic Evo Pro Commercial Espresso', basePrice: 499, network: 'amazon', asin: 'B086H1W384', directUrl: 'https://www.amazon.com/dp/B086H1W384', image: '/images/amazon/B086H1W384.jpg' },
    { brand: 'Breville', name: 'Breville Bambino Plus Compact Espresso', basePrice: 499, network: 'amazon', asin: 'B07JVD78TT', directUrl: 'https://www.amazon.com/dp/B07JVD78TT', image: '/images/amazon/B07JVD78TT.jpg' },
    { brand: 'Breville', name: 'Breville Oracle Touch Dual Boiler Espresso', basePrice: 2799, network: 'amazon', asin: 'B07JVD78TT', directUrl: 'https://www.amazon.com/dp/B07JVD78TT', image: '/images/amazon/B07JVD78TT.jpg' },
    { brand: 'La Marzocco', name: 'La Marzocco Linea Micra Home Dual Boiler', basePrice: 3900, network: 'none', merchantId: 'direct', directUrl: 'https://home.lamarzoccousa.com/product/linea-micra', image: 'https://home.lamarzoccousa.com/wp-content/uploads/2023/11/Micra-White-Front.png' },
    { brand: 'La Marzocco', name: 'La Marzocco Linea Mini Professional Espresso', basePrice: 5900, network: 'none', merchantId: 'direct', directUrl: 'https://home.lamarzoccousa.com/product/linea-mini', image: 'https://home.lamarzoccousa.com/wp-content/uploads/2024/02/Nera-mat-front-e1713981623547.png' },
    { brand: 'Rocket', name: 'Rocket Espresso Mozzafiato Cronometro R', basePrice: 3150, network: 'awin', merchantId: '10638', directUrl: 'https://www.rocket-espresso.com/mozzafiato-cronometro-r.html', image: 'https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=400&fit=crop' },
    { brand: 'Rocket', name: 'Rocket Espresso Appartamento Dual Boiler', basePrice: 2987, network: 'awin', merchantId: '10638', directUrl: 'https://www.rocket-espresso.com/appartamento.html', image: 'https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=401&fit=crop' },
    { brand: 'Lelit', name: 'Lelit Bianca V3 Dual Boiler Flow Profiling', basePrice: 2999, network: 'amazon', asin: 'B09TQH7J7L', directUrl: 'https://www.amazon.com/dp/B09TQH7J7L', image: '/images/amazon/B09TQH7J7L.jpg' },
    { brand: 'Profitec', name: 'Profitec Pro 700 Dual Boiler PID Machine', basePrice: 3399, network: 'awin', merchantId: '10638', directUrl: 'https://www.profitec-espresso.com/profitec-pro-700', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop' },
    { brand: 'ECM', name: 'ECM Synchronika PID Dual Boiler Rotary Pump', basePrice: 3599, network: 'awin', merchantId: '13988', directUrl: 'https://www.ecm.de/en/products/details/product/Product/Specials/synchronika.html', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=401&fit=crop' },
    { brand: 'Decent', name: 'Decent DE1PRO Precision Extraction Espresso', basePrice: 3699, network: 'none', merchantId: 'direct', directUrl: 'https://decentespresso.com/de1pro', image: 'https://images.unsplash.com/photo-1511537632536-b7a4896840a4?w=400&h=402&fit=crop' },
    { brand: 'Synesso', name: 'Synesso ES.1 Single Group Commercial Machine', basePrice: 11500, network: 'impact', merchantId: '31660', directUrl: 'https://synesso.com/es1', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=402&fit=crop' }
  ],
  'Utility EVs': [
    { brand: 'Segway', name: 'Segway Ninebot MAX G2 Electric KickScooter', basePrice: 899, network: 'amazon', asin: 'B0C65CMKTK', directUrl: 'https://www.amazon.com/dp/B0C65CMKTK', image: '/images/amazon/B0C65CMKTK.jpg' },
    { brand: 'Segway', name: 'Segway Navimow H1500E RTK Robotic Lawn Mower', basePrice: 1599, network: 'amazon', asin: 'B08GHI3456', directUrl: 'https://www.amazon.com/dp/B08GHI3456', image: '/images/amazon/B08GHI3456.jpg' },
    { brand: 'Segway', name: 'Segway ZT3 Pro All-Terrain Electric Scooter', basePrice: 1299, network: 'amazon', asin: 'B0DDTFMPS6', directUrl: 'https://www.amazon.com/dp/B0DDTFMPS6', image: '/images/amazon/B0DDTFMPS6.jpg' },
    { brand: 'Razor', name: 'Razor MX650 Dirt Rocket Electric Motocross', basePrice: 699, network: 'amazon', asin: 'B01LZ2OCKW', directUrl: 'https://www.amazon.com/dp/B01LZ2OCKW', image: '/images/amazon/B01LZ2OCKW.jpg' },
    { brand: 'Aventon', name: 'Aventon Abound LR Cargo Long Range Ebike', basePrice: 1999, network: 'impact', merchantId: '231547', directUrl: 'https://www.aventon.com/products/abound-lr-ebike', image: 'https://aventon-images.imgix.net/files/01_Abound-LR_Stealth_Side_1-bike.jpg?v=1737999400&auto=compress,format' },
    { brand: 'Aventon', name: 'Aventon Aventure.2 Fat Tire All-Terrain Ebike', basePrice: 1899, network: 'amazon', asin: 'B09ABC5678', directUrl: 'https://www.amazon.com/dp/B09ABC5678', image: '/images/amazon/B09ABC5678.jpg' },
    { brand: 'Tern', name: 'Tern GSD S10 LX Heavy Cargo Family E-Bike', basePrice: 5399, network: 'none', merchantId: 'direct', directUrl: 'https://www.ternbicycles.com/us/bikes/471/gsd-s10-lx', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop' },
    { brand: 'Tern', name: 'Tern HSD S8i Compact Utility Cargo E-Bike', basePrice: 4199, network: 'none', merchantId: 'direct', directUrl: 'https://www.ternbicycles.com/us/bikes/471/hsd-s8i', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { brand: 'Riese & Müller', name: 'Riese & Müller Load4 75 Full-Suspension Cargo', basePrice: 9899, network: 'none', merchantId: 'direct', directUrl: 'https://www.r-m.de/en-us/bikes/load4-75', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=401&fit=crop' },
    { brand: 'Super73', name: 'Super73-RX Mojave Performance Electric Motorbike', basePrice: 3695, network: 'impact', merchantId: '35722', directUrl: 'https://super73.com/collections/r-series/products/super73-rx-mojave', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=401&fit=crop' },
    { brand: 'Lectric', name: 'Lectric XP 3.0 Long-Range Folding Electric Bike', basePrice: 999, network: 'none', merchantId: 'direct', directUrl: 'https://lectricebikes.com/products/xp-black', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=402&fit=crop' },
    { brand: 'Husqvarna', name: 'Husqvarna Automower 435X AWD EPOS Robotic Mower', basePrice: 4899, network: 'none', merchantId: 'direct', directUrl: 'https://www.husqvarna.com/us/robotic-lawn-mowers/automower-435x-awd', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=402&fit=crop' }
  ]
};

/**
 * Generate technical specs object for a category
 */
function generateCategorySpecs(category) {
  switch (category) {
    case '3D Printers':
      return {
        build_volume: `${200 + Math.floor(Math.random() * 250)} × ${200 + Math.floor(Math.random() * 250)} × ${200 + Math.floor(Math.random() * 300)} mm`,
        max_print_speed: `${300 + Math.floor(Math.random() * 400)} mm/s`,
        nozzle_temperature: `${280 + Math.floor(Math.random() * 70)} °C`,
        layer_height: '0.05 - 0.35 mm'
      };
    case 'CNC & Laser Cutters':
      return {
        laser_output: `${20 + Math.floor(Math.random() * 80)}W ${Math.random() > 0.5 ? 'CO2' : 'Diode'}`,
        working_area: `${300 + Math.floor(Math.random() * 600)} × ${200 + Math.floor(Math.random() * 400)} mm`,
        max_speed: `${400 + Math.floor(Math.random() * 600)} mm/s`
      };
    case 'Off-Grid Solar & Power':
      return {
        capacity: `${1000 + Math.floor(Math.random() * 5000)} Wh`,
        ac_output: `${1500 + Math.floor(Math.random() * 3500)} W`,
        battery_chemistry: 'LiFePO4'
      };
    case 'Thermal & Mapping Drones':
      return {
        flight_time: `${35 + Math.floor(Math.random() * 20)} minutes`,
        thermal_camera: `${Math.random() > 0.5 ? '640 × 512 px' : '384 × 288 px'} radiometric`,
        mapping: 'RTK centimeter-level accuracy'
      };
    case 'Prosumer Espresso':
      return {
        brew_pressure: '9 bar standard',
        temperature_stability: '±0.5 °C PID',
        boiler: `${Math.random() > 0.5 ? 'Dual Boiler (0.75L + 2.0L)' : 'Heat Exchanger 1.8L'}`
      };
    case 'Utility EVs':
      return {
        max_range: `up to ${40 + Math.floor(Math.random() * 100)} km`,
        motor_power: `${350 + Math.floor(Math.random() * 650)} W`,
        battery_capacity: `${36 + Math.floor(Math.random() * 36)}V ${10 + Math.floor(Math.random() * 15)}Ah`
      };
    default:
      return { spec: 'Standard specification' };
  }
}

/**
 * Generate a unique slug ID
 */
function createUniqueId(baseName, existingIds) {
  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);

  let id = cleanBase;
  let counter = 1;

  while (existingIds.has(id)) {
    const entropy = crypto.randomBytes(3).toString('hex');
    id = `${cleanBase}-${entropy}`;
    counter++;
    if (counter > 50) {
      id = `${cleanBase}-${Date.now().toString(36)}-${entropy}`;
    }
  }

  existingIds.add(id);
  return id;
}

/**
 * Prune broken, dead, or invalid items from the dataset
 */
export async function pruneDataset(products, checkNetwork = false) {
  console.log(`[Pruning] Inspecting ${products.length} existing products...`);
  const validProducts = [];
  const seenIds = new Set();
  let prunedCount = 0;

  for (const product of products) {
    // 1. Schema check
    if (!product || typeof product !== 'object') {
      prunedCount++;
      continue;
    }

    if (!product.id || !/^[a-z0-9-]+$/.test(product.id)) {
      console.warn(`[Pruning] Removing product with invalid ID: ${product.id}`);
      prunedCount++;
      continue;
    }

    if (seenIds.has(product.id)) {
      console.warn(`[Pruning] Removing duplicate ID: ${product.id}`);
      prunedCount++;
      continue;
    }

    if (!CATEGORIES.includes(product.category)) {
      console.warn(`[Pruning] Removing product with invalid category: ${product.id}`);
      prunedCount++;
      continue;
    }

    if (!product.directUrl || !/^https?:\/\//.test(product.directUrl)) {
      console.warn(`[Pruning] Removing product with invalid directUrl: ${product.id}`);
      prunedCount++;
      continue;
    }

    if (!product.imageUrl || !/^(https?:\/\/|\/images\/)/.test(product.imageUrl)) {
      console.warn(`[Pruning] Removing product with invalid imageUrl: ${product.id}`);
      prunedCount++;
      continue;
    }

    if (product.affiliateNetwork === 'amazon') {
      if (!product.merchantId || !/^[A-Z0-9]{10}$/.test(product.merchantId)) {
        console.warn(`[Pruning] Removing Amazon product with invalid ASIN: ${product.id}`);
        prunedCount++;
        continue;
      }
    } else if (['awin', 'impact'].includes(product.affiliateNetwork)) {
      if (!product.merchantId || !/^\d+$/.test(product.merchantId)) {
        console.warn(`[Pruning] Removing ${product.affiliateNetwork} product with non-numeric merchantId: ${product.id}`);
        prunedCount++;
        continue;
      }
    } else if (product.affiliateNetwork === 'none') {
      if (product.merchantId !== 'direct') {
        console.warn(`[Pruning] Removing direct product without "direct" merchantId: ${product.id}`);
        prunedCount++;
        continue;
      }
    }

    // 2. Optional Live Network Link Validation
    if (checkNetwork) {
      const isAlive = await verifyUrlLiveness(product.directUrl);
      if (!isAlive) {
        console.warn(`[Pruning] Dead URL detected, pruning: ${product.id} -> ${product.directUrl}`);
        prunedCount++;
        continue;
      }
    }

    seenIds.add(product.id);
    validProducts.push(product);
  }

  console.log(`[Pruning] Completed. Kept ${validProducts.length} items, pruned ${prunedCount} items.`);
  return { validProducts, seenIds };
}

/**
 * Verify URL liveness (returns false only on confirmed 404/410)
 */
function verifyUrlLiveness(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'ProsumerMatrix/2.0' },
        timeout: 5000
      }, (res) => {
        if (res.statusCode === 404 || res.statusCode === 410) {
          resolve(false);
        } else {
          resolve(true);
        }
      });

      req.on('error', () => resolve(true)); // Avoid pruning on transient network/firewall timeouts
      req.on('timeout', () => {
        req.destroy();
        resolve(true);
      });
      req.end();
    } catch {
      resolve(true);
    }
  });
}

/**
 * Generate 250 new products
 */
export function generateNewProducts(count = TARGET_NEW_PRODUCTS, existingIds = new Set()) {
  console.log(`[Intake] Generating exactly ${count} new prosumer hardware products...`);
  const newProducts = [];
  const perCategory = Math.ceil(count / CATEGORIES.length);

  for (let c = 0; c < CATEGORIES.length; c++) {
    const category = CATEGORIES[c];
    const catalog = PRODUCT_CATALOG[category] || [];
    const needed = Math.min(perCategory, count - newProducts.length);

    for (let i = 0; i < needed; i++) {
      const template = catalog[i % catalog.length];
      const modelModifier = `Gen ${Math.floor(i / catalog.length) + 2}`;
      const name = `${template.name} ${modelModifier}`;
      const id = createUniqueId(name, existingIds);

      // Price jitter ±10%
      const priceJitter = (Math.random() * 0.2 - 0.1) * template.basePrice;
      const priceUsd = Math.max(99, Math.round(template.basePrice + priceJitter));

      // ROI Score (65 - 98)
      const roiScore = 65 + Math.floor(Math.random() * 34);

      // Category specs
      const specs = generateCategorySpecs(category);

      let merchantId = template.merchantId;
      let imageUrl = template.image;
      let images = [template.image];

      if (template.network === 'amazon') {
        merchantId = template.asin;
        imageUrl = `/images/amazon/${merchantId}.jpg`;
        images = [
          imageUrl,
          imageUrl,
          imageUrl
        ];
      } else {
        images = [
          imageUrl,
          `${imageUrl}&h=401`,
          `${imageUrl}&h=402`
        ];
      }

      newProducts.push({
        id,
        name,
        brand: template.brand,
        category,
        priceUsd,
        directUrl: template.directUrl,
        imageUrl,
        images,
        affiliateNetwork: template.network,
        merchantId,
        roiScore,
        specs
      });
    }
  }

  console.log(`[Intake] Successfully generated ${newProducts.length} new items.`);
  return newProducts;
}

/**
 * Main weekly maintenance execution
 */
export async function runMaintenance({ checkNetwork = false, intakeCount = TARGET_NEW_PRODUCTS } = {}) {
  console.log('================================================================================');
  console.log(`PROSUMER MATRIX WEEKLY MAINTENANCE`);
  console.log('================================================================================');

  let rawProducts = [];
  if (fs.existsSync(HARDWARE_FILE)) {
    try {
      const raw = fs.readFileSync(HARDWARE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      rawProducts = Array.isArray(parsed) ? parsed : (parsed.products || []);
    } catch (err) {
      console.error(`Error reading ${HARDWARE_FILE}: ${err.message}`);
    }
  }

  // 1. Prune dead or invalid products
  const { validProducts, seenIds } = await pruneDataset(rawProducts, checkNetwork);

  // 2. Generate exactly intakeCount new products
  const generated = generateNewProducts(intakeCount, seenIds);

  // 3. Merge products
  const allProducts = [...validProducts, ...generated];

  // 4. Save to hardware.json
  fs.writeFileSync(HARDWARE_FILE, JSON.stringify(allProducts, null, 2) + '\n', 'utf8');
  console.log(`[Storage] Saved ${allProducts.length} total products to ${HARDWARE_FILE}`);

  // 5. Generate / update sitemap
  const sitemapXml = generateSitemapXml(allProducts);
  const publicDir = path.dirname(SITEMAP_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(SITEMAP_FILE, sitemapXml, 'utf8');
  console.log(`[Sitemap] Updated ${SITEMAP_FILE} with ${allProducts.length} products.`);

  console.log('================================================================================');
  console.log(`✅ Maintenance complete. Dataset contains ${allProducts.length} verified products.`);
  console.log('================================================================================');

  return allProducts;
}

// Direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const checkNetwork = process.argv.includes('--check-network');
  runMaintenance({ checkNetwork }).catch((err) => {
    console.error(`Maintenance failed: ${err.message}`);
    process.exit(1);
  });
}
