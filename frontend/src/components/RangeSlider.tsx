import { Component, DivElement, InputElement, ref } from "typecomposer";



export class RangeSlider extends Component {

  values = ref({ min: 0, max: 100 });
  sliderOne!: InputElement;
  sliderTwo!: InputElement;
  minGap = 0;
  sliderTrack!: DivElement;
  sliderMaxValue = 0;

  constructor(public min: number = 0, public max: number = 100) {
    super();
    this.values.value.min = min;
    this.values.value.max = max;
  }


  onInit(): void {
    this.sliderMaxValue = parseInt(this.sliderOne.max);
    this.inputSlideOne();
    this.inputSlideTwo();
  }

  inputSlideOne() {
    if (parseInt(this.sliderTwo.value) - parseInt(this.sliderOne.value) <= this.minGap) {
      this.sliderOne.value = `${this.sliderTwo.valueAsNumber - this.minGap}`;
    }
    this.fillColor();
  }

  inputSlideTwo() {
    if (parseInt(this.sliderTwo.value) - parseInt(this.sliderOne.value) <= this.minGap) {
      this.sliderTwo.value = `${parseInt(this.sliderOne.value) + this.minGap}`;
    }
    this.fillColor();
  }

  fillColor() {
    const percent1 = (this.sliderOne.valueAsNumber / this.sliderMaxValue) * 100;
    const percent2 = (this.sliderTwo.valueAsNumber / this.sliderMaxValue) * 100;
    this.sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
  }

  template() {
    return (<div class="wrapper">
      <span text={this.values.value.min} />
      <div class="container">
        <div ref={this.sliderTrack} class="slider-track"></div>
        <input style={{ paddingLeft: "0" }} type="range" min={this.min} max={this.max} value={this.values.value.min} ref={this.sliderOne} oninput={this.inputSlideOne} />
        <input type="range" min={this.min} max={this.max} ref={this.sliderTwo} value={this.values.value.max} oninput={this.inputSlideTwo} />
      </div>
      <span text={this.values.value.max} />
    </div>
    )
  }

}