# Product Features

## Overview

This document tracks all features of the Course Marketplace platform. It serves as a reference for developers, testers, and stakeholders to ensure alignment on scope and requirements.

---

## Feature Change

[ ] - **Checkout & Payment (Guest Mode)** — Guest-only multi-step checkout with PromptPay QR and Credit Card (Omise), coupon/discount codes, VAT breakdown, tax-invoice capture, Omise webhook processing, JWT magic access links, and receipt + admin notification emails → see [plans/02-checkout-backend.md](plans/02-checkout-backend.md) · [plans/03-checkout-frontend.md](plans/03-checkout-frontend.md)

[ ] - **Homepage Redesign — "The Armored Obsidian"** — Full homepage redesign implementing the Armored Obsidian design system: dark-themed sticky header, hero section with live stat badges, searchable/filterable course grid, full-width marketing CTA banner, and a global footer — frontend-only, no auth or backend changes → see [plans/04-homepage-redesign.md](plans/04-homepage-redesign.md)

## Technical Change

[x] - set up initial project structure and tooling (NestJS, Next.js, Docker Compose, Biome, CI) → see [plans/01-project-setup.md](plans/01-project-setup.md)
