# AI Resume Screener & Candidate Matcher ⚡

**Commercial Offer Reference:** Malt Job Ref #MALT-AI-2024-195 ("Plateforme IA de parsing, filtrage et scoring automatique de CV")
**Estimated Price Range:** 5 000 € – 8 000 €
**Target TJM:** 700 € / jour

## Overview
An AI-powered recruitment web application for HR teams and headhunters. Instantly parses candidate CVs, compares skills against job specifications, calculates match scores (0-100%), and identifies missing critical requirements.

## Features
- **Job Match Scoring:** Automated semantic skill matching and experience scoring.
- **Missing Skill Gap Analysis:** Highlights mandatory vs. bonus candidate skills.
- **Instant Search & Filter:** Filter by match score threshold, years of experience, and key technologies.
- **Candidate Dossier Export:** Generate instant candidate assessment summaries.

## Bolt Performance Highlights
- ⚡ **Memoized Candidate Scoring:** Calculates score vectors once per profile update using a lookup Set for O(1) skill intersection tests.
- ⚡ **Client-Side Virtualized Pagination:** Renders only active page DOM nodes (5 items per page) to prevent browser memory leaks on hundreds of candidate profiles.
- ⚡ **Fast Text Tokenizer:** Linear scan keyword extraction avoiding costly regex backtracking.
