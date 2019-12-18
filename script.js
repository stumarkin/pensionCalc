var app4 = new Vue({
  el: "#app-4",
  data: {
    currentSalaryPercentage: 25,
    currentSalaryMin: 30,
    currentSalaryMax: 500,

    suspectedSalaryGrowthPercentage: 25,
    suspectedSalaryGrowthMin: 0,
    suspectedSalaryGrowthMax: 20,
    
    investValueFromSalaryPercentage: 10,
    
    currentAge: 30,
    suspectedPensionAge: 65,
    
    suspectedPensionNeedsPercentage: 30,
    suspectedPensionNeedsMin: 10,
    suspectedPensionNeedsMax: 200,
    
    suspectedInvestmentProfitPercentage: 40,
    suspectedInvestmentProfitMin: 0,
    suspectedInvestmentProfitMax: 20,
    
    inflation: 4,
    
    iis: true
  },
  computed: {
    currentAgeStr: function() {
      var modulo = this.currentAge % 10;
      var str = "лет";
      switch (modulo) {
        case 1:
          str = 'год';
          break;
        case 2:
        case 3:
        case 4:
          str = 'года';
      }
      if ((this.currentAge>10)&&(this.currentAge<15)){
        str = "лет";
      }
      return str;
      
    },
    currentSalary: function() {
      return (
        Math.ceil(
          (this.currentSalaryMax - this.currentSalaryMin) *
            (this.currentSalaryPercentage / 100)
        ) + this.currentSalaryMin
      );
    },
    suspectedSalaryGrowth: function() {
      return (
        Math.ceil(
          (this.suspectedSalaryGrowthMax - this.suspectedSalaryGrowthMin) *
            (this.suspectedSalaryGrowthPercentage / 100)
        ) + this.suspectedSalaryGrowthMin
      );
    },
    suspectedPensionNeeds: function() {
      return (
        Math.ceil(
          (this.suspectedPensionNeedsMax - this.suspectedPensionNeedsMin) *
            (this.suspectedPensionNeedsPercentage / 100)
        ) + this.suspectedPensionNeedsMin
      );
    },
    suspectedInvestmentProfit: function() {
      return (
        Math.ceil(
          (this.suspectedInvestmentProfitMax - this.suspectedInvestmentProfitMin) *
            (this.suspectedInvestmentProfitPercentage / 100)
        ) + this.suspectedInvestmentProfitMin
      );
    },
    suspectedInvestmentValues: function() {
      var arSuspectedInvestmentValues = [];
      var now = new Date();
      arSuspectedInvestmentValues[0]={
          year: now.getFullYear(),
          age: this.currentAge,  
          salary: this.currentSalary*12,
          invest: this.currentSalary*12*this.investValueFromSalaryPercentage/100,
          capital: this.currentSalary*12*this.investValueFromSalaryPercentage/100,
          profit: 0,
          pension: 0,
          needs: this.suspectedPensionNeeds
      };
       
      
      let year, age, salary, invest, profit, iisProfit, pension, capital, needs, highlight;
      for (let i = 1; i < 100-this.currentAge; i++) {
        year = now.getFullYear() + i;
        age = i + Number(this.currentAge);
        salary = ( age < this.suspectedPensionAge) ? salary = arSuspectedInvestmentValues[i-1].salary + (arSuspectedInvestmentValues[i-1].salary*this.suspectedSalaryGrowth/100) : 0;
        invest = salary * this.investValueFromSalaryPercentage / 100;
        if ((this.iis==true) && (i<4)){
          iisProfit = ( arSuspectedInvestmentValues[i-1].invest > 400 ? 400 : arSuspectedInvestmentValues[i-1].invest ) * 13 / 100;
        } else {
          iisProfit = 0;
        }
        profit = iisProfit + ( arSuspectedInvestmentValues[i-1].capital * this.suspectedInvestmentProfit / 100 );
        pension = ( age >= this.suspectedPensionAge) ? pension = profit/12 : 0;
        capital = arSuspectedInvestmentValues[i-1].capital + invest + profit - pension*12;
        needs = arSuspectedInvestmentValues[i-1].needs + ( arSuspectedInvestmentValues[i-1].needs*this.inflation / 100 );
        highlight = ( age == this.suspectedPensionAge) ? true : false;
        
        arSuspectedInvestmentValues[i]={
          year: year,
          age: age, 
          salary: salary,
          invest: salary * this.investValueFromSalaryPercentage / 100,
          capital: capital,
          profit: profit,
          iisProfit: iisProfit,
          pension: pension,
          needs: needs,
          highlight: highlight
        } ;
        
      }
      //console.log(arSuspectedInvestmentValues);
      
    return arSuspectedInvestmentValues ;
  },
    suspectedInvestmentValuesSummary: function () {
    return {
      capital: this.suspectedInvestmentValues[this.suspectedPensionAge-this.currentAge].capital,
      pension: this.suspectedInvestmentValues[this.suspectedPensionAge-this.currentAge].pension
      }
  }
  },
  methods: {
    getYearsStr: function (Years){
      var modulo = Years % 10;
      var str = "лет";
      switch (modulo) {
        case 1:
          str = 'год';
          break;
        case 2:
        case 3:
        case 4:
          str = 'года';
      }
      if ((Years>10)&&(Years<15)){
        str = "лет";
      }
      return str;
    }
  }
});