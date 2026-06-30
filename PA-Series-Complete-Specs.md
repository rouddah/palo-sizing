# Palo Alto Networks PA-Series — Complete Technical Specifications
> All data extracted directly from official Palo Alto Networks datasheets (PAN-OS 12.1 unless noted).
> No data has been invented or inferred. Sources: official PDF datasheets downloaded from paloaltonetworks.com (March 2026).

---

## PA-400 Series
**Models:** PA-410, PA-415, PA-415-5G, PA-440, PA-445, PA-450, PA-455, PA-455-5G, PA-460
**Target:** Distributed enterprise branch offices, retail locations, midsized businesses
**Form Factor:** Desktop
**Measured on:** PAN-OS 12.1

### Table 1 — Performance and Capacities

| Metric | PA-410 | PA-415 | PA-415-5G | PA-440 | PA-445 | PA-450 | PA-455 | PA-455-5G | PA-460 |
|---|---|---|---|---|---|---|---|---|---|
| Firewall throughput (appmix) | 1.4 Gbps | 1.5 Gbps | 1.5 Gbps | 2.4 Gbps | 2.7 Gbps | 3.3 Gbps | 3.6 Gbps | 3.2 Gbps | 4.2 Gbps |
| Threat Prevention throughput (appmix) | 0.8 Gbps | 0.8 Gbps | 0.8 Gbps | 1.2 Gbps | 1.25 Gbps | 2.1 Gbps | 2.3 Gbps | 1.8 Gbps | 3.0 Gbps |
| IPsec VPN throughput | 0.5 Gbps | 0.5 Gbps | 0.5 Gbps | 1.1 Gbps | 1.1 Gbps | 1.7 Gbps | 1.8 Gbps | 1.6 Gbps | 2.3 Gbps |
| Max concurrent sessions | 64,000 | 64,000 | 64,000 | 200,000 | 200,000 | 300,000 | 300,000 | 300,000 | 400,000 |
| New sessions per second | 11,000 | 11,000 | 11,400 | 34,000 | 34,000 | 48,000 | 56,000 | 48,000 | 67,000 |
| Virtual systems (base/max) | 1/1 | 1/1 | 1/1 | 1/2 | 1/2 | 1/5 | 1/5 | 1/5 | 1/5 |

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, DNS Security, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Adding virtual systems over base quantity requires a separately purchased license (min PAN-OS 11.0 for PA-415-5G and PA-455; PA-455-5G needs 11.2 for VSYS)

### Table 2 — Hardware Specifications

#### I/O (Data Ports)
| Model | Ports |
|---|---|
| PA-410 | 1G RJ45 (7) |
| PA-440, PA-450, PA-460 | 1G RJ45 (8) |
| PA-415, PA-445 | 1G SFP/RJ45 combo (1), 1G RJ45 (4), 1G RJ45/PoE (4) |
| PA-415-5G | Embedded 5G cellular module; 1G SFP/RJ45 combo (1), 1G RJ45 (4), 1G RJ45/PoE (4) |
| PA-455 | 1G SFP/RJ45 combo (2), 1G RJ45 (2), 1G RJ45/PoE (4) |
| PA-455-5G | Embedded 5G cellular module; 1G SFP/RJ45 combo (2), 1G RJ45 (6), 1G RJ45 PoE (4) |

#### Management I/O
| Model | Management Ports |
|---|---|
| PA-410 | 10/100/1000 OOB mgmt port (1), RJ45 console (1), USB (2) |
| PA-415, PA-415-5G, PA-445 | SFP/RJ45 (1 GB) combo mgmt port (1), RJ45 console (1), USB (2), Micro USB console (1) |
| PA-440, PA-450, PA-455, PA-460 | 10/100/1000 OOB mgmt port (1), RJ45 console (1), USB (2), Micro USB console (1) |
| PA-455-5G | SFP/RJ45 (1 GB) combo mgmt port (1), RJ45 console (1), USB (1) |

#### Storage
| Model | Storage |
|---|---|
| PA-410 | 64 GB eMMC |
| PA-415, PA-415-5G, PA-440, PA-445, PA-450, PA-455, PA-455-5G, PA-460 | 128 GB eMMC |

#### Power over Ethernet (PoE)
- Models with PoE: PA-415, PA-415-5G, PA-445, PA-455, PA-455-5G
- PoE ports: 4x 1G RJ45
- Total PoE Budget: 91 W (PA-455-5G: 151 W)
- Maximum load on a single port: 60 W

#### Power Consumption
| Model | Avg Power Consumption | Max Power Consumption |
|---|---|---|
| PA-410 | 17 W | 23 W |
| PA-415 or PA-415-5G | 133 W (with 91 W PoE output) | 142 W (with 91 W PoE output) |
| PA-440 | 28.9 W | 34.3 W |
| PA-450 or PA-460 | 32.6 W | 41.3 W |
| PA-445 | 140 W (with 91 W PoE output) | 146 W (with 91 W PoE output) |
| PA-455 | 125.2 W (with 91 W PoE output) | 143.4 W (with 91 W PoE output) |
| PA-455-5G | 195 W (with 151 W PoE output) | 212 W (with 151 W PoE output) |

#### Max BTU/hr
| Model | Max BTU/hr |
|---|---|
| PA-410 | 78 |
| PA-415, PA-440, PA-445 | 117 |
| PA-450, PA-460 | 141 |
| PA-415-5G | 150 |
| PA-455 | 205 |
| PA-455-5G | 655 |

#### Input Voltage
- 100–240 VAC (50–60 Hz)

#### Max Current Consumption
| Model | Max Current |
|---|---|
| PA-410 | 1.5 A @ 12 VDC |
| PA-415, PA-440, PA-445 | 2.9 A @ 12 VDC |
| PA-450, PA-460 | 3.4 A @ 12 VDC |
| PA-415-5G | 3.7 A @ 12 VDC |
| PA-455 | 5 A @ 12 VDC |
| PA-455-5G | 3.6 A @ 54 VDC |

#### Max Inrush Current
| Model | Inrush Current |
|---|---|
| PA-410 | 2.1 A |
| PA-415, PA-440, PA-445 | 3.3 A |
| PA-450, PA-460 | 4.2 A |
| PA-415-5G | 3.5 A |
| PA-455 | 4.4 A |
| PA-455-5G | 5.2 A @ 54 VDC input |

#### Dimensions (H x D x W)
| Model | Dimensions |
|---|---|
| PA-410 | 1.63" H x 6.42" D x 9.53" W |
| PA-415 | 1.73" H x 9" D x 13" W |
| PA-445 | 1.66" H x 8.87" D x 13" W |
| PA-440, PA-450, PA-460 | 1.74" H x 8.83" D x 8.07" W |
| PA-415-5G | 1.73" H x 9" D x 13" W |
| PA-455 | 1.7" H x 9.4" D x 15.4" W |
| PA-455-5G | 1RU H x 283 mm D x 303 mm W |

#### Weight (Standalone / As Shipped)
| Model | Weight |
|---|---|
| PA-410 | 3.1 lbs / 5.9 lbs |
| PA-415 | 7.85 lbs / 12.2 lbs |
| PA-445 | 8.7 lbs / 12.6 lbs |
| PA-440, PA-450, PA-460 | 5.0 lbs / 7.8 lbs |
| PA-415-5G | 7.85 lbs |
| PA-455 | 9.8 lbs / 14.1 lbs |
| PA-455-5G | 9 lbs / TBD |

#### Environmental
- Operating temperature: 32°F to 104°F (0°C to 40°C)
- Non-operating temperature: -4°F to 158°F (-20°C to 70°C)
- Cooling: Passive (fanless)
- Safety: cTUVus, CB
- EMI: FCC Class B, CE Class B, VCCI Class B
- TPM: Integrated (secure boot, hardware root of trust)

---

## PA-1400 Series
**Models:** PA-1410, PA-1420
**Target:** Branch offices and midsize businesses
**Form Factor:** 1U rack-mount
**Measured on:** PAN-OS 12.1

### Table 1 — Performance and Capacities

| Metric | PA-1410 | PA-1420 |
|---|---|---|
| Firewall throughput (appmix) | 8.5 Gbps | 9.5 Gbps |
| Threat Prevention throughput (appmix) | 4.5 Gbps | 6.2 Gbps |
| IPsec VPN throughput | 4.1 Gbps | 5.6 Gbps |
| Max concurrent sessions | 945,000 | 1.4M |
| New sessions per second | 100,000 | 140,000 |
| Virtual systems (base/max) | 1/6 | 1/6 |

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, DNS Security, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Adding virtual systems over base quantity requires a separately purchased license

### Table 2 — Hardware Specifications

#### I/O (Data Ports)
| Model | Ports |
|---|---|
| PA-1410 | 10/100/1000 (8), 1G/2.5G/5G (4)/PoE, 1G SFP (6), 1G/10G SFP/SFP+ (4) |
| PA-1420 | 10/100/1000 (4), 1G/2.5G/5G (4), 1G/2.5G/5G (4)/PoE, 1G SFP (2), 1G/10G SFP/SFP+ (8) |

#### Management I/O (both models)
- 10/100/1000 OOB management port (1)
- HSCI 10 Gigabit high availability (1)
- RJ-45 console port (1)
- USB port (1)
- Micro USB console port (1)

#### Power over Ethernet (PoE)
- PA-1410 and PA-1420 Total PoE Power Budget: 151 W
- Maximum load on single port: 90 W

#### Storage
| Model | Storage |
|---|---|
| PA-1410 | 120 GB SSD |
| PA-1420 | 240 GB SSD |

#### Power Supply
- AC 450 W power supply (1); optional 2nd AC 450 W power supply purchasable

| Model | Avg Power Consumption | Max Power Consumption |
|---|---|---|
| PA-1410 | 250 W | 290 W |
| PA-1420 | 260 W | 300 W |

#### Rack Mount Dimensions (both models)
- 1U, 19" standard rack: 1.70" H x 14.15" D x 17.15" W

#### Weight (both models)
- 15.5 lbs (standalone)

#### MTBF
- 24 years

#### Input Voltage
- 100–240 VAC (50–60 Hz)

#### Environmental
- Operating temperature: 0°C to 40°C at 10,000 feet
- Non-operating temperature: -4°F to 158°F (-20°C to 70°C)
- Airflow: Front to back
- Safety: cTUVus, CB
- EMI: FCC Class A, CE Class A, VCCI Class A
- TPM: Integrated (secure boot, hardware root of trust)

---

## PA-3400 Series
**Models:** PA-3410, PA-3420, PA-3430, PA-3440
**Target:** High-speed internet gateway deployments
**Form Factor:** 1U rack-mount
**Measured on:** PAN-OS 12.1

### Table 1 — Performance and Capacities

| Metric | PA-3410 | PA-3420 | PA-3430 | PA-3440 |
|---|---|---|---|---|
| Firewall throughput (appmix) | 14 Gbps | 19 Gbps | 29 Gbps | 35 Gbps |
| Threat Prevention throughput (appmix) | 7.5 Gbps | 10 Gbps | 15 Gbps | 20 Gbps |
| IPsec VPN throughput | 6.6 Gbps | 9.9 Gbps | 12 Gbps | 14.5 Gbps |
| Max concurrent sessions | 1.4M | 2.2M | 2.5M | 3M |
| New sessions per second | 145,000 | 220,000 | 240,000 | 268,000 |
| Virtual systems (base/max) | 1/11 | 1/11 | 1/11 | 1/11 |

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Adding virtual systems over base quantity requires a separately purchased license

### Table 2 — Hardware Specifications

#### I/O (Data Ports)
| Model | Ports |
|---|---|
| PA-3410 | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4) |
| PA-3420 | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4) |
| PA-3430 | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4), 40G/100G QSFP/QSFP28 (2) |
| PA-3440 | 1G/2.5G/5G/10G (12), 1G/10G SFP/SFP+ (10), 25G SFP28 (4), 40G/100G QSFP/QSFP28 (2) |

#### Management I/O (all models)
- 100/1000 OOB management port (1)
- 100/1000 high availability (2)
- 10G SFP+ high availability (1)
- RJ-45 console port (1)
- Micro USB (1)

#### Storage (all models)
- 480 GB SSD

#### Power Supply (all models)
- Redundant 450-watt AC
- Avg / Max Power Consumption: 133 W / 190 W

#### Max BTU/hr (all models)
- 650

#### Input Voltage
- AC: 100–240 VAC (50–60 Hz)

#### Max Current Consumption
- AC: 1.9 A @ 100 VAC, 0.8 A @ 240 VAC

#### MTBF
- 22 years

#### Rack Mount Dimensions (all models)
- 1U, 19" standard rack: 14.15" D x 17.15" W x 1.70" H

#### Weight
- Standalone: 15.5 lbs / As shipped: 25 lbs

#### Environmental
- Operating temperature: 32°F to 104°F (0°C to 40°C)
- Non-operating temperature: -4°F to 158°F (-20°C to 70°C)
- Humidity tolerance: 10% to 90%
- Maximum altitude: 10,000 ft / 3,048 m
- Airflow: Front to back
- Safety: cTUVus, CB
- EMI: FCC Class A, CE Class A, VCCI Class A
- TPM: Integrated (secure boot, hardware root of trust)

**Note:** PA-3430 and PA-3440 support Mobile Network Infrastructure (5G Security, GTP Security, SCTP Security).

---

## PA-5400 Series
**Models:** PA-5410, PA-5420, PA-5430, PA-5440, PA-5445
**Target:** High-speed data center, internet gateway, and service provider deployments
**Form Factor:** 2U rack-mount
**Measured on:** PAN-OS 12.1

### Table 1 — Performance and Capacities

| Metric | PA-5410 | PA-5420 | PA-5430 | PA-5440 | PA-5445 |
|---|---|---|---|---|---|
| Firewall throughput (appmix) | 52 Gbps | 70 Gbps | 80 Gbps | 85 Gbps | 90 Gbps |
| Threat Prevention throughput (appmix) | 35 Gbps | 50 Gbps | 60 Gbps | 70 Gbps | 76 Gbps |
| IPsec VPN throughput | 20 Gbps | 28 Gbps | 42 Gbps | 58 Gbps | 64 Gbps |
| Max concurrent sessions | 5M | 7M | 9M | 20M | 48M |
| New sessions per second | 270,000 | 370,000 | 380,000 | 390,000 | 449,000 |
| Virtual systems (base/max) | 10/20 | 15/65 | 25/125 | 25/225 | 25/225 |

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Adding virtual systems over base quantity requires a separately purchased license

### Table 2 — Hardware Specifications

#### I/O (Data Ports — all models share the same port configuration)
- 1G/2.5G/5G/10G (8)
- 1G/10G SFP/SFP+ (12)
- 1G/10G/25G SFP/SFP+/SFP28 (4)
- 40G/100G QSFP+/QSFP28 (4)

#### Management I/O (all models)
- 1G/10G SFP/SFP+ OOB management port (1)
- 1G/10G SFP/SFP+ high availability (2)
- 40G QSFP+ high availability (1)
- RJ-45 console port (1)
- Micro USB console

#### Storage
- 480 GB SSD pair (system storage)

#### Power Supply (all models)
- Avg / Max Power Consumption: 630 W / 760 W
- Power supplies: 1:1 fully redundant (2/2 base/max)
- AC power supply output: 1,200 W per power supply

#### Max BTU/hr
- 1,638

#### Input Voltage
- AC: 100–240 VAC (50–60 Hz)
- DC: Available

#### Max Current Consumption
- AC: 7 A @ 100 VAC, 3 A @ 240 VAC
- DC: 15 A @ -48 VDC, 12 A @ -60 VDC

#### Max Inrush Current
- AC: 50 A @ 230 VAC, 50 A @ 120 VAC
- DC: 200 A @ 72 VDC

#### MTBF
- 22 years

#### Rack Mount Dimensions
- 2U, 19" standard rack: 3.45" H x 22.5" D x 17.34" W

#### Weight
- Standalone: 35.2 lbs / As shipped: 48.8 lbs

#### Environmental
- Operating temperature: 32°F to 122°F (0°C to 50°C)
- Non-operating temperature: -4°F to 158°F (-20°C to 70°C)
- Humidity tolerance: 10% to 90%
- Maximum altitude: 10,000 ft / 3,048 m
- Airflow: Front to back
- Safety: cTUVus, CB
- EMI: FCC Class A, CE Class A, VCCI Class A
- TPM: Integrated (secure boot, hardware root of trust)

**Note:** PA-5400 Series supports Mobile Network Infrastructure (5G Security, GTP Security, SCTP Security).

---

## PA-7500 Series
**Model:** PA-7500 (single chassis model; performance scales with card population)
**Target:** Large enterprise data centers, high-bandwidth network perimeters, service providers
**Form Factor:** 14U chassis (modular)
**Measured on:** PAN-OS 11.1

### Table 1 — Performance and Capacities

| Metric | PA-7500-DPC-A (per card) | PA-7500 Full System* |
|---|---|---|
| Firewall throughput (appmix) | 310 Gbps | 1,500 Gbps |
| Threat Prevention throughput (appmix) | 250 Gbps | 1,440 Gbps |
| IPsec VPN throughput | 67 Gbps | 407 Gbps |
| Max concurrent sessions | 73M | 440M |
| New sessions per second | 1.2M | 7.2M |
| Virtual systems (base/max) | — | 25/225 |

*Full system results derived from a configuration using **six PA-7500-DPC-A cards** and two PA-7500-NPC-A cards.

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, DNS Security, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Adding virtual systems over base quantity requires a separately purchased license; NGFW Cluster A/A supports max 25 Virtual Systems

### Table 2 — Hardware Specifications

#### Architecture / Slots
- Nine front-facing slots for cards (MPC, NPC, DPC)
- Minimum configuration: at least one MPC, one NPC, and one DPC
- One or two rear-mounted Switching Fabric Cards (PA-7500-SFC-A) with optional redundancy

#### I/O (per PA-7500-NPC-A card)
- QSFP-DD (8): supports 400 Gbps / 100 Gbps / 40 Gbps with hardware breakout support
- SFP-DD (12): 100 Gbps / 25 Gbps / 10 Gbps

#### Management I/O (per PA-7500-MPC-A card)
- QSFP28 logging port (2): 100 Gbps / 40 Gbps
- QSFP-DD high availability port (2): 400 Gbps / 100 Gbps
- SFP28 management port (2): 1 Gbps / 10 Gbps / 25 Gbps
- Combo RJ45 console port (1)
- Micro USB console port (1)
- USB (1)

#### Power Supply
- Reference configuration: SFCs (2), NPCs (2), DPCs (6), MPC (1)

| State | @ 25°C, sea level | @ 40°C, 2,000 ft altitude |
|---|---|---|
| Idle | 6.3 KW | 7.3 KW |
| Typical | 8.2 KW | 9.2 KW |
| Max | 10 KW | 11.5 KW |

- Power supplies: N+M redundancy (up to 10 power supplies with load sharing)
- AC input voltage: 100–240 VAC (50–60 Hz)
- AC rated input current: 20 A
- AC power supply output: 3,600 W @ High Line (180V/200/240V/305V); 1,800 W @ Low Line (90V/110/120V/132V) per supply
- DC input voltage: -48V DC
- DC rated input current: 83 A @ -48V DC
- DC power output: 3,600 W per power supply
- Max current per supply: 20 A (AC), 83 A (DC)

#### Max BTU/hr
- 31,142 (total power minus fan power, BTU units; reference config: SFCs 2, NPCs 2, DPCs 6, MPC 1)

#### Rack Mount Dimensions
- 14U, 19" standard rack: 24.4" H x 31.0" D x 17.4" W

#### Environmental
- Operating temperature: 32°F–104°F (0°C–40°C)
- Humidity tolerance: 5% to 90% noncondensing
- Airflow: Front to back
- Safety: cMETus, CB; Noise Level Compliant with NEBS
- EMI: FCC Class A, CE Class A, VCCI Class A
- TPM: Integrated (secure boot, hardware root of trust)

---

## PA-7000 Series
**Models:** PA-7050, PA-7080
**Target:** Large enterprise data centers, high-bandwidth network perimeters, service providers
**Form Factor:** PA-7050: 9U chassis; PA-7080: 19U chassis (both modular)
**Measured on:** PAN-OS 11.2

### Table 1 — Performance and Capacities

| Metric | PA-7000-100G-NPC-A (per card) | PA-7000-DPC-A (per card) | PA-7050* | PA-7080* |
|---|---|---|---|---|
| Firewall throughput (appmix) | 51.5 Gbps | 68.6 Gbps | 343 Gbps | 590 Gbps |
| Threat Prevention throughput (appmix) | 26.5 Gbps | 35.3 Gbps | 184 Gbps | 305 Gbps |
| IPsec VPN throughput | 26 Gbps | 34 Gbps | 190 Gbps | 310 Gbps |
| Max concurrent sessions | 32M | 43M | 245M | 416M |
| New sessions per second | 560,000 | 746,000 | 4M | 6M |
| Virtual systems (base/max) | — | — | 25/225 | 25/225 |

*Full system results derived from an optimum combination of PA-7000-DPC-A and PA-7000-100G-NPC-A cards in all available slots.

**Measurement notes:**
- Firewall throughput: App-ID and logging enabled, appmix transactions
- Threat Prevention throughput: App-ID, IPS, antivirus, antispyware, WildFire, file blocking, and logging enabled, appmix transactions
- IPsec VPN throughput: 64 KB HTTP transactions, logging enabled
- Max concurrent sessions: HTTP transactions
- New sessions/sec: application override, 1-byte HTTP transactions
- Base system includes 25 virtual systems at no cost; up to 200 additional licenses purchasable (max 225)

### Table 2 — Hardware Specifications

#### I/O
| Component | PA-7000-100G-NPC-A (per card) | PA-7050 Full System | PA-7080 Full System |
|---|---|---|---|
| SFP/SFP+ ports | 8 | 48 | 80 |
| QSFP+/QSFP28 ports | 4 | 24 | 40 |

#### Management / System Cards
| Component | Details |
|---|---|
| PA-7050-SMC-B / PA-7080-SMC-B | SFP MGT (2), SFP HA1 (2), HSCI HA2/HA3 QSFP+/QSFP28 (2), RJ45 serial console (1), Micro USB serial console (1) |
| PA-7000-LFC-A | 480 GB SSD, system drive RAID1 (2 × 240 GB) |

#### Power
| Spec | PA-7050 | PA-7080 |
|---|---|---|
| AC input voltage | 100–240 VAC (50–60 Hz) | 100–240 VAC (50–60 Hz) |
| Rated AC input current | 27–12 A | 65–27 A |
| AC power supply output | 2,500 W @ 240 VAC / 1,200 W @ 120 VAC | 2,500 W @ 240 VAC / 1,200 W @ 120 VAC |
| DC input voltage | -40 to -60 VDC | -40 to -60 VDC |
| Rated DC input current | 60 A | 135 A |
| DC power output | 2,500 W per power supply | 2,500 W per power supply |
| Max current per supply (AC) | 16 A @ 180 VAC in | 12 A @ 240 VAC in |
| Max current per supply (DC) | 75 A @ 37.5 VDC in | 75 A @ >40 VDC in |
| Power supplies (base/max) | 4/4 | 4/8 |
| Max inrush current | 50 A AC / 75 A DC peak | 30 A AC / 100 A DC peak |

#### Max BTU/hr
| Model | Max BTU/hr |
|---|---|
| PA-7050 | 10,236 |
| PA-7080 | 20,132 |

#### Rack Mount Dimensions
| Model | Dimensions |
|---|---|
| PA-7050 | 9U, 19" standard rack: 15.75" H x 19" W x 24" D |
| PA-7080 | 19U, 19" standard rack: 32.22" H x 19" W x 24.6" D |

#### Weight
| Model | Standalone Weight |
|---|---|
| PA-7050 | 187.4 lbs (AC) / 185 lbs (DC) |
| PA-7080 | 299.3 lbs (AC) / 298.3 lbs (DC) |

#### Environmental
- Operating temperature: 32°F to 122°F (0°C to 50°C)
- Non-operating temperature: -4°F to 158°F (-20°C to 70°C)
- Safety: cTUVus, CB
- EMI: FCC Class A, CE Class A, VCCI Class A
- Certifications: NEBS Level 3

**Note:** PA-7000 Series supports Mobile Network Infrastructure (5G Security, GTP Security, SCTP Security).

---

## Quick Reference Comparison Table (All Series)

| Model | FW Throughput (appmix) | Threat Prev. Throughput | IPsec VPN Throughput | Max Sessions | New Sessions/sec | Form Factor |
|---|---|---|---|---|---|---|
| **PA-410** | 1.4 Gbps | 0.8 Gbps | 0.5 Gbps | 64,000 | 11,000 | Desktop |
| **PA-415** | 1.5 Gbps | 0.8 Gbps | 0.5 Gbps | 64,000 | 11,000 | Desktop |
| **PA-415-5G** | 1.5 Gbps | 0.8 Gbps | 0.5 Gbps | 64,000 | 11,400 | Desktop |
| **PA-440** | 2.4 Gbps | 1.2 Gbps | 1.1 Gbps | 200,000 | 34,000 | Desktop |
| **PA-445** | 2.7 Gbps | 1.25 Gbps | 1.1 Gbps | 200,000 | 34,000 | Desktop |
| **PA-450** | 3.3 Gbps | 2.1 Gbps | 1.7 Gbps | 300,000 | 48,000 | Desktop |
| **PA-455** | 3.6 Gbps | 2.3 Gbps | 1.8 Gbps | 300,000 | 56,000 | Desktop |
| **PA-455-5G** | 3.2 Gbps | 1.8 Gbps | 1.6 Gbps | 300,000 | 48,000 | Desktop |
| **PA-460** | 4.2 Gbps | 3.0 Gbps | 2.3 Gbps | 400,000 | 67,000 | Desktop |
| **PA-1410** | 8.5 Gbps | 4.5 Gbps | 4.1 Gbps | 945,000 | 100,000 | 1U Rack |
| **PA-1420** | 9.5 Gbps | 6.2 Gbps | 5.6 Gbps | 1.4M | 140,000 | 1U Rack |
| **PA-3410** | 14 Gbps | 7.5 Gbps | 6.6 Gbps | 1.4M | 145,000 | 1U Rack |
| **PA-3420** | 19 Gbps | 10 Gbps | 9.9 Gbps | 2.2M | 220,000 | 1U Rack |
| **PA-3430** | 29 Gbps | 15 Gbps | 12 Gbps | 2.5M | 240,000 | 1U Rack |
| **PA-3440** | 35 Gbps | 20 Gbps | 14.5 Gbps | 3M | 268,000 | 1U Rack |
| **PA-5410** | 52 Gbps | 35 Gbps | 20 Gbps | 5M | 270,000 | 2U Rack |
| **PA-5420** | 70 Gbps | 50 Gbps | 28 Gbps | 7M | 370,000 | 2U Rack |
| **PA-5430** | 80 Gbps | 60 Gbps | 42 Gbps | 9M | 380,000 | 2U Rack |
| **PA-5440** | 85 Gbps | 70 Gbps | 58 Gbps | 20M | 390,000 | 2U Rack |
| **PA-5445** | 90 Gbps | 76 Gbps | 64 Gbps | 48M | 449,000 | 2U Rack |
| **PA-7050** | 343 Gbps | 184 Gbps | 190 Gbps | 245M | 4M | 9U Chassis |
| **PA-7080** | 590 Gbps | 305 Gbps | 310 Gbps | 416M | 6M | 19U Chassis |
| **PA-7500** | 1,500 Gbps | 1,440 Gbps | 407 Gbps | 440M | 7.2M | 14U Chassis |

---

*Data sourced from official Palo Alto Networks PDF datasheets:*
- *PA-400 Series Datasheet (strata_ds_pa-400-series_022326) — PAN-OS 12.1*
- *PA-1400 Series Datasheet (strata_ds_pa-1400-series_012726) — PAN-OS 12.1*
- *PA-3400 Series Datasheet (strata_ds_pa-3400-series_021126) — PAN-OS 12.1*
- *PA-5400 Series Datasheet (strata_ds_pa-5400-series_032026) — PAN-OS 12.1*
- *PA-7500 Datasheet (strata_ds_pa-7500_031126) — PAN-OS 11.1*
- *PA-7000 Series Datasheet (strata_ds_pa-7000-series_071624) — PAN-OS 11.2*
