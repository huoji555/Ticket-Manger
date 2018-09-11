package com.account.vo;

public class BeTrade {

  private String tradeType;
  private Float  minRate;
  private Float  maxRate;

    public String getTradeType() { return tradeType; }
    public void setTradeType(String tradeType) { this.tradeType = tradeType; }

    public Float getMinRate() { return minRate; }
    public void setMinRate(Float minRate) { this.minRate = minRate; }

    public Float getMaxRate() { return maxRate; }
    public void setMaxRate(Float maxRate) { this.maxRate = maxRate; }
}
