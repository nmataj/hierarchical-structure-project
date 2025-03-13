export function createHeaders(headerGroup, headers, barWidth, barHeight) {
  headerGroup.selectAll("*").remove();

  headers.forEach((header, index, color) => {
    headerGroup.append('rect')
      .attr('x', index * (barWidth / headers.length))
      .attr('y', 0)
      .attr('width', barWidth / headers.length)
      .attr('height', barHeight)

    headerGroup.append('text')
      .attr('x', index * (barWidth / headers.length) + 2)
      .attr('y', barHeight - 18)
      .attr('alignment-baseline', 'middle')
      .attr('font-size', '25px')
      .attr('font-weight', 'bold')
      .text(header);
  });
}