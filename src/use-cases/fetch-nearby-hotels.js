export class FetchNearbyHotelsUseCase {
  cosntructor(hotelsRepository) {
    this.hotelsRepository = hotelsRepository;
  }

  async execute({ latitude, longitude }) {
    const hotels = await this.hotelsRepository.findManyNearby({
      latitude,
      longitude,
    });
    return {
      hotels,
    };
  }
}
