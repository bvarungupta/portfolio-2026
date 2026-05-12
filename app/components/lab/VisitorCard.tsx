"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as htmlToImage from "html-to-image";

type CardColor = "pink" | "teal" | "green" | "orange" | "neutral";

const BUTTERFLIES: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢔⣶⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠗⡿⣾⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠓⡞⢩⣯⡀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠰⡹⠁⢰⠃⣩⣿⡇⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣿⠿⣉⣩⠛⠲⢶⡠⢄⠐⣣⠃⣰⠗⠋⢀⣯⠁⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣯⣠⠬⠦⢤⣀⠈⠓⢽⣾⢔⣡⡴⠞⠻⠙⢳⡄",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣵⣳⠖⠉⠉⢉⣩⣵⣿⣿⣒⢤⣴⠤⠽⣬⡇",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢻⣟⠟⠋⢡⡎⢿⢿⠳⡕⢤⡉⡷⡽⠁",
  "⣧⢮⢭⠛⢲⣦⣀⠀⠀⠀⠠⡀⠀⠀⠀⡾⣥⣏⣖⡟⠸⢺⠀⠀⠈⠙⠋⠁⠀⠀",
  "⠈⠻⣶⡛⠲⣄⠀⠙⠢⣀⠀⢇⠀⠀⠀⠘⠿⣯⣮⢦⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢻⣿⣥⡬⠽⠶⠤⣌⣣⣼⡔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢠⣿⣧⣤⡴⢤⡴⣶⣿⣟⢯⡙⠒⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠘⣗⣞⣢⡟⢋⢜⣿⠛⡿⡄⢻⡮⣄⠈⠳⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠈⠻⠮⠴⠵⢋⣇⡇⣷⢳⡀⢱⡈⢋⠛⣄⣹⣲⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣱⡇⣦⢾⣾⠿⠟⠿⠷⠷⣻⠧⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠽⠞⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
];

const TEAL_ART: string[] = [
  "⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃",
  "⠀⠀⠀⠀⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀",
];

const GREEN_ART: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⠴⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢾⣛⡆⠈⡏⠰⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⣿⣄⣉⣁⣤⠽⣦⣤⡶⠶⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠚⠹⡉⢃⣴⠟⠉⠀⠀⠀⠀⠉⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⢡⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡂⣿⡇⠀⠀⠀⠀⣠⣤⣀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢻⣷⠀⠀⠀⠀⢯⡉⣿⡆⠀⠀⣰⡇⠀⢀⣀⢤⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣧⣀⠀⠀⢀⣴⡟⠀⠀⣰⣿⡷⢏⡭⠔⠹⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠿⠿⠟⠋⠀⢀⣼⣿⣿⣿⠿⣭⡉⢛⡃⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⣀⣤⠶⠿⣟⣟⣝⡷⣲⢤⣀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⣠⣾⡿⠃⠹⡟⢖⠢⠽⠦⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢀⣴⠞⠁⠀⠀⠀⠀⠀⠉⠙⢦⣕⡯⣷⣄⠀⠀⠠⣴⠋⢓⡶⠂⠀⢀⣼⣿⠟⠁⠀⠀⠈⠺⡄⠋⣀⣰⣀⠀⠀⠀⠀⠀⠀",
  "⠀⣠⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢯⣒⢭⣦⠀⠀⢸⠕⠦⠇⠀⣤⣿⡿⠃⣠⠴⠶⠶⣤⡀⠀⠀⠼⠿⡏⠀⠀⠀⠀⠀⠀",
  "⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣝⡫⢧⠀⠀⠀⠀⣠⣾⡿⠉⠀⢸⠁⢀⣀⠀⠈⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⣼⠁⠀⠀⠀⠀⣠⣶⣿⣿⣷⣦⡀⠀⠀⠀⠀⠙⡮⣛⡆⠀⠀⣰⣿⡏⢐⡀⠀⠸⣦⣀⣨⠇⠒⣸⣀⣀⣄⣀⡀⠀⠀⠀⠀⠀⠀",
  "⢹⠆⠀⠀⠀⢠⣿⡿⠃⠀⠀⠉⢻⡄⠀⠀⠀⠀⠙⣗⢿⠀⣸⡟⡙⢷⡈⢠⠀⡀⠈⠉⣁⠘⣠⠟⠉⠉⠙⢿⣿⡆⠀⠀⠀⠀⠀",
  "⠘⣇⠀⠀⠀⠈⢿⡇⠀⢲⠀⠀⠀⢻⡀⠀⢤⣴⡀⠹⣽⣴⡿⣁⠀⠈⠻⣦⣤⣥⣌⣡⡤⠞⠁⠀⣰⠛⠆⣸⣿⡇⠀⠀⠀⠀⠀",
  "⠀⢻⡄⠀⠀⠀⠀⠉⠙⠉⠀⠀⠀⢸⠀⠀⠚⠻⠁⠀⢿⣿⢣⢀⡤⠶⠲⢮⣍⡉⠉⠁⠀⣤⠀⠀⠘⢿⣿⡿⠏⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢻⣄⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⡀⠀⠀⠀⠀⢸⣿⣰⠏⢀⡴⢶⡄⢸⡇⠀⢖⠚⠉⠓⣲⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠙⠷⣦⣄⣀⣀⣠⣴⠾⠁⠀⢰⣕⢲⣪⡉⠅⣾⣿⡟⠀⠈⠳⠭⠵⠋⠀⠀⣼⣁⢄⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠀⠀⠀⢤⡼⠉⢹⡣⣉⠀⣿⣿⡇⠀⠀⢠⣴⠶⢦⡀⠀⠁⠀⠀⣙⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡔⠟⡛⡀⡆⣿⡟⣷⠀⠀⣿⣇⣲⠈⡿⢀⣴⣾⣿⠿⠿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢰⡀⡷⣰⣇⡴⠠⠜⠀⠀⠀⠀⣿⡇⡘⣷⣄⠀⠙⣉⠞⢡⣿⡟⠁⠀⠀⠀⠀⠈⠻⣿⣆⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠠⣤⣯⣷⣧⠿⠵⠶⠶⣤⣄⡀⠀⢻⣇⠡⡌⠻⣏⠉⠁⠀⢺⣿⠀⠀⢀⣶⣶⣤⠀⠀⠘⣿⡀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠠⢾⡿⡋⠗⠈⠃⠈⠁⠰⠉⡻⢶⣜⣿⢘⠂⣠⣌⣷⡀⠀⢸⣿⡆⠀⠈⠧⠄⢸⡇⠀⠀⣹⠇⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⣰⠏⠄⠁⠀⠀⠀⠀⠀⠀⠀⠁⠈⠙⢿⣏⠰⡏⣬⣿⢻⡀⠀⠻⣿⣄⠀⠀⣠⠞⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢰⡏⠴⠀⠀⠀⠀⢀⣠⣀⣀⠀⠀⠀⠀⠈⢻⣧⡙⢦⣤⡾⠁⠀⠀⠈⠙⠛⠋⠁⠀⠀⣠⡞⠁⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠸⢿⡀⠀⠀⠀⣰⠋⠁⠀⠉⠙⢦⠀⠀⠀⠀⢻⣟⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠾⠋⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢹⡹⣇⠀⠀⠘⡇⠀⠀⠖⡆⠀⠘⣧⠀⠀⠀⠀⠻⣎⢿⠹⠳⢲⡲⢶⠶⠾⠛⠉⣁⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠸⣎⡹⣧⡀⠀⠻⣦⣤⠴⠃⠀⢰⠏⠀⣤⣀⣴⠀⠙⣧⡱⡀⢠⡾⢟⣛⡓⣆⠀⠿⣿⠛⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠱⣊⠜⣻⣶⣄⣀⠀⠀⠀⣀⠟⠠⣔⣊⠁⣶⣄⠀⠈⢷⣅⢸⠅⢸⣓⣃⣼⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠙⢮⡞⡜⡝⡝⡟⡯⠟⠁⠀⠀⠀⠈⠿⠀⠀⠀⠀⠀⠹⣶⡳⢤⣹⣯⡥⠴⠶⠶⠦⣄⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣀⠀⠈⠻⣦⡀⠀⠀⡞⣙⣷⠀⢈⡆⠀⠀⣀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠏⣤⢈⣿⠀⠀⠀⠈⠳⣄⠈⣷⣈⣉⣠⡼⢡⡾⠛⠉⠙⢳⡀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣄⠈⠉⠁⢀⣀⣤⣶⣶⣾⣷⣌⠙⠋⠁⠀⣿⠀⢤⡀⠀⠀⣷",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠛⠛⠉⠁⡼⠋⢠⠨⠍⡳⢄⡀⠀⠘⠻⠛⠁⠀⣰⡿",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⣔⡒⡞⡀⠁⠰⠙⡲⢦⣤⣤⣤⣾⠿⠁",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠺⠞⠧⠁⠀⠀⠀⠁⠐⠉⠉⠉⠀⠀⠀",
];

const ORANGE_ART: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣴⣦⣦⡄⠀⠀⠀⠀",
  "⠀⠀⠀⣀⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀",
  "⠀⣰⣿⣿⠿⢿⣿⣿⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⠿⠛⠉⠉⠁⠉⠉⠙⠻⣧⠀",
  "⣰⣿⣿⡟⠀⠀⠈⠙⠛⠿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆",
  "⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⢿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣧",
  "⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⠈⠙⠻⣿⣷⣄⣤⣤⣤⣦⣾⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡿",
  "⣿⣿⣿⣷⣄⣀⣀⣀⣀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣶⣶⣿⣶⣶⣤⣀⠀⠀⢀⠀⠀⠀⠀⣀⣠⣾⣿⣿⠃",
  "⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠋⠉⠉⣴⣾⣿⣿⣿⣿⣿⣿⣯⣍⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠃⠀",
  "⠀⠀⠉⠛⠻⠿⠿⠿⠿⠿⠿⠛⠋⠀⠀⠀⠀⢠⣾⣿⣿⠟⠁⠁⠀⠈⠻⣿⣿⣷⡀⠀⠀⠉⠛⠻⠿⠿⠻⠿⠿⠟⠋⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠹⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣀⣠⣤⣴⣶⣶⣾⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣴⣿⣿⣿⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀",
  "⠀⣸⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠻⣿⣿⣿⣧⡀⠀⠀⠀",
  "⢀⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣧⠀⠀⠀",
  "⠸⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⡆⠀⠀",
  "⠀⠹⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⡧⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠏⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠟⠀⠀⠀",
];

const colorMap: Record<CardColor, { bg: string; text: string; label: string; flowerBase: string; cardTint: string }> = {
  pink: { bg: "#B55A75", text: "#ffffff", label: "Pink", flowerBase: "rgba(255, 255, 255, 0.4)", cardTint: "#B55A75" },
  teal: { bg: "#17889A", text: "#ffffff", label: "Teal", flowerBase: "rgba(255, 255, 255, 0.4)", cardTint: "#17889A" },
  green: { bg: "#1A7B45", text: "#ffffff", label: "Green", flowerBase: "rgba(255, 255, 255, 0.4)", cardTint: "#1A7B45" },
  orange: { bg: "#C7773A", text: "#ffffff", label: "Orange", flowerBase: "rgba(255, 255, 255, 0.4)", cardTint: "#C7773A" },
  neutral: { bg: "#E2E2E2", text: "#000000", label: "Neutral", flowerBase: "rgba(0, 0, 0, 0.15)", cardTint: "#E2E2E2" },
};

const ART_MAP: Record<CardColor, { lines: string[]; fontSize: string; lineHeight: string; right: string; bottom: string }> = {
  pink: { lines: BUTTERFLIES, fontSize: "15px", lineHeight: "1.08", right: "-32px", bottom: "-18px" },
  teal: { lines: TEAL_ART, fontSize: "15px", lineHeight: "1.08", right: "-10px", bottom: "-8px" },
  green: { lines: GREEN_ART, fontSize: "7.5px", lineHeight: "1.1", right: "-6px", bottom: "-16px" },
  orange: { lines: ORANGE_ART, fontSize: "9px", lineHeight: "1.08", right: "-8px", bottom: "-6px" },
  neutral: { lines: BUTTERFLIES, fontSize: "15px", lineHeight: "1.08", right: "-32px", bottom: "-18px" },
};

function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickGlimmers(lines: string[], count: number, seed: number) {
  const rng = mulberry32(seed);
  const positions: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < lines.length; r++) {
    const chars = Array.from(lines[r]);
    for (let c = 0; c < chars.length; c++) {
      const ch = chars[c];
      if (ch !== "⠀" && ch !== " " && ch !== "") positions.push({ row: r, col: c });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions.slice(0, count).map((p) => ({
    row: p.row,
    col: p.col,
    delay: Number((rng() * 3.6).toFixed(2)),
    duration: Number((2.2 + rng() * 1.6).toFixed(2)),
  }));
}

export default function VisitorCard() {
  const [name, setName] = useState("Jane Doe");
  const [color, setColor] = useState<string>("teal");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Random 5 digit number for card
  const [cardNumber, setCardNumber] = useState(0);
  useEffect(() => {
    setCardNumber(Math.floor(Math.random() * 90000) + 10000);
  }, []);

  const [dateFormatted, setDateFormatted] = useState("");
  useEffect(() => {
    const d = new Date();
    setDateFormatted(`${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`);
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Only resize if it hasn't been set to avoid clearing the canvas on re-renders
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 3;
    }
    // Update stroke color when color changes
    const textColor = colorMap[color as CardColor]?.text || "#ffffff";
    ctx.strokeStyle = textColor;
  }, [color]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath(); // reset path so next click doesn't connect
      
      // Check if canvas has ink
      const ctx2 = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx2) {
          const pixels = ctx2.getImageData(0, 0, canvas.width, canvas.height).data;
          let hasInk = false;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] > 0) {
              hasInk = true;
              break;
            }
          }
          setHasSignature(hasInk);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High res
      });
      const link = document.createElement("a");
      link.download = `visitor-card-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download card:", err);
    }
  }, [name]);

  const isCustomColor = !(color in colorMap);
  const activeTheme = isCustomColor 
    ? { bg: color, text: "#ffffff", label: "Custom", flowerBase: "rgba(255, 255, 255, 0.4)", cardTint: color }
    : colorMap[color as CardColor];
  
  const activeArt = isCustomColor ? ART_MAP["neutral"] : ART_MAP[color as CardColor];

  const { renderedLines } = useMemo(() => {
    const glimmers = pickGlimmers(activeArt.lines, 20, isCustomColor ? 0x9999 : 0x1234);
    const map = new Map<string, { delay: number; duration: number }>();
    for (const g of glimmers) map.set(`${g.row}:${g.col}`, { delay: g.delay, duration: g.duration });
    
    const lines = activeArt.lines.map((line, r) => {
      return {
        row: r,
        chars: Array.from(line).map((ch, c) => ({
          ch,
          col: c,
          g: map.get(`${r}:${c}`)
        }))
      };
    });

    return { renderedLines: lines };
  }, [activeArt.lines, isCustomColor]);

  return (
    <div className="flex flex-col md:flex-row gap-12 items-start justify-between w-full">
      {/* Left Column: Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-8">
        <div>
          <label className="block text-sm text-gray-500 mb-2 uppercase tracking-widest font-mono">
            1. Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={30}
            placeholder="Enter your name"
            className="w-full bg-black/5 border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:border-black/30 transition-colors font-sans"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2 uppercase tracking-widest font-mono">
            2. Choose Color
          </label>
          <div className="flex gap-3 items-center">
            {(Object.keys(colorMap) as CardColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  color === c ? "border-black scale-110" : "border-transparent hover:scale-105 shadow-sm"
                }`}
                style={{ backgroundColor: colorMap[c].bg }}
                aria-label={`Select ${c} color`}
              />
            ))}
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            {/* Custom Color Picker */}
            <div className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center overflow-hidden cursor-pointer ${
              isCustomColor ? "border-black scale-110" : "border-gray-200 hover:scale-105 shadow-sm"
            }`}>
              <div 
                className="absolute inset-0 pointer-events-none rounded-full" 
                style={{ 
                  background: 'url(/images/HomeImages/color-wheel.png) center/cover',
                  animation: !isCustomColor ? 'color-wheel-spin 12s linear infinite' : 'none'
                }}
              />
              <input
                type="color"
                value={isCustomColor ? color : "#ffffff"}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                title="Pick custom color"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-500 uppercase tracking-widest font-mono">
              3. Signature
            </label>
            {hasSignature && (
              <button
                onClick={clearSignature}
                className="text-xs text-gray-500 hover:text-black transition-colors underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative w-full aspect-[2.5/1] bg-black/5 border border-black/10 rounded-lg overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
            {!hasSignature && !isDrawing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 text-black font-mono text-sm">
                Draw here
              </div>
            )}
          </div>
        </div>

        <button
          onClick={downloadCard}
          className="w-full flex justify-center items-center gap-3 px-5 py-3 border border-gray-900 text-gray-900 text-xs tracking-widest hover:bg-gray-900 hover:text-white transition-colors duration-200 mt-4 uppercase"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Download Card
        </button>
      </div>

      {/* Right Column: Card Preview */}
      <div className="w-full md:w-2/3 flex items-center justify-center">
        <style dangerouslySetInnerHTML={{ __html: `
          .visitor-card-flower .glimmer {
            display: inline-block;
            color: #ffffff;
            animation: flower-glimmer var(--glimmer-duration, 2.8s) ease-in-out var(--glimmer-delay, 0s) infinite;
          }
          @keyframes flower-glimmer {
            0%, 100% {
              opacity: 0.2;
              text-shadow: 0 0 0 transparent;
              transform: scale(1);
            }
            35% {
              opacity: 1;
              text-shadow: 0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.4);
              transform: scale(1.4);
            }
            60% {
              opacity: 0.1;
              text-shadow: 0 0 0 transparent;
              transform: scale(1);
            }
            82% {
              opacity: 1;
              text-shadow: 0 0 5px rgba(255, 255, 255, 0.85), 0 0 10px rgba(255, 255, 255, 0.35);
              transform: scale(1.2);
            }
          }
          @keyframes color-wheel-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}} />
        <div
          ref={cardRef}
          className="relative w-full max-w-[388px] aspect-[388/252] rounded-[24px] overflow-hidden shadow-xl transition-colors duration-500 p-7 flex flex-col font-mono uppercase select-none"
          style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
        >
          {/* Decorative Pattern / Braille simulation */}
          <pre
            aria-hidden="true"
            className="absolute pointer-events-none whitespace-pre opacity-80 visitor-card-flower"
            style={{
              color: activeTheme.flowerBase,
              fontSize: activeArt.fontSize,
              lineHeight: activeArt.lineHeight,
              right: activeArt.right,
              bottom: activeArt.bottom,
            }}
          >
            {renderedLines.map((line) => (
              <div key={line.row}>
                {line.chars.map((c) => {
                  if (c.g) {
                    return (
                      <span
                        key={c.col}
                        className="glimmer"
                        style={{
                          '--glimmer-delay': `${c.g.delay}s`,
                          '--glimmer-duration': `${c.g.duration}s`,
                        } as React.CSSProperties}
                      >
                        {c.ch}
                      </span>
                    );
                  }
                  return c.ch;
                })}
              </div>
            ))}
          </pre>

          <h2 className="font-light text-[24px] leading-none normal-case relative z-10" style={{ fontFamily: 'Garamond, serif' }}>
            Varun&rsquo;s World
          </h2>

          <dl className="mt-6 flex flex-col gap-2 relative z-10">
            <div className="flex flex-col">
              <dt className="text-[14px] leading-none opacity-60" style={{ color: activeTheme.text }}>Visitor</dt>
              <dd className="text-[18px] leading-none mt-1.5 font-medium">{name || "..."}</dd>
            </div>
            <div className="flex flex-col mt-2">
              <dt className="text-[14px] leading-none opacity-60" style={{ color: activeTheme.text }}>Issued on</dt>
              <dd className="text-[18px] leading-none mt-1.5 font-medium">{dateFormatted || "..."}</dd>
            </div>
          </dl>

          <div className="mt-auto flex items-end justify-between relative z-10">
            <p className="text-[14px] leading-none opacity-60" style={{ color: activeTheme.text }}>
              No. {cardNumber}
            </p>
            <div className="flex items-end gap-2 grow ml-12">
              <span className="text-[18px] leading-none">x</span>
              <span className="block flex-1 border-b mb-1 opacity-50" style={{ borderColor: activeTheme.text }}></span>
            </div>
          </div>

          {/* Signature Overlay - We mirror the canvas drawing onto this area */}
          {hasSignature && (
            <div className="absolute bottom-6 right-8 w-1/2 h-1/3 pointer-events-none z-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={canvasRef.current?.toDataURL() || ""} 
                    alt="Signature" 
                    className="w-full h-full object-contain object-bottom-right"
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
