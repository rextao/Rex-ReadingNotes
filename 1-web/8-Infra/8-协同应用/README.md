1. 协同在技术层面，旨在解决：
   - 多端同步：不限于多用户，也可以单用户的不同设备、或者同设备的不同应用
   - 最终一致：由于网络的时延、断网恢复等，不同端可能缺失、乱序、重复，但要保持最终是相同的
   - 冲突解决：多端可能有相同的意图，比如都改动了同一个状态，需要有自动解决冲突的能力
2. 